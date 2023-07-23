const express = require('express');
const http = require('http');
const https = require('https');
const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 443;

const { combine, timestamp, printf, align } = winston.format;

const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: './logs/server-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
  });

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss A',
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [fileRotateTransport],
});

app.use(function (req, res, next) {
    let filename = path.basename(req.url);
    let extension = path.extname(filename);
    if(extension === '.wav') {
        logger.info('Served ' + filename);
    }
    if(!(extension === '.ico' || extension === '.css' || extension === '.js' || extension === '.png' || extension === '')) {
        logger.warn('Unexpected request for ' + filename);
    }
    next();
});

app.use(express.static(path.join(__dirname, 'resources')));
app.use(express.urlencoded());

app.set('trust proxy', true);

const httpOptions = {
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'samplesequencer.pem')),
    key: fs.readFileSync(path.join(__dirname, 'certs', 'samplesequencer.key'))
};

https.createServer(httpOptions, app).listen(port, () => {
    logger.info(`Listening on port ${port}`);
})

http.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
    logger.info('Redirect to https');
}).listen(80);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
    logger.info('Connection from ' + req.ip);
});

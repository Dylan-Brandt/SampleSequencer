const express = require('express');
const http = require('http');
const https = require('https');
const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');

const app = express();

const { combine, timestamp, printf, align } = winston.format;

const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: './logs/server-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
  });

const timezoned = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'America/Chicago'
    });
}

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp({
          format: timezoned,
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
        logger.info('Served ' + filename + ' to ' + req.ip);
    }
    else if(!(extension === '.ico' || extension === '.css' || extension === '.js' || extension === '.png' || extension === '')) {
        logger.warn('Unexpected request for ' + filename + ' from ' + req.ip);
    }
    next();
});

app.use(express.static(path.join(__dirname, 'resources')));
app.use(express.urlencoded());

app.set('trust proxy', true);

// const httpOptions = {
//     cert: fs.readFileSync(path.join(__dirname, 'certs', 'samplesequencer.pem')),
//     key: fs.readFileSync(path.join(__dirname, 'certs', 'samplesequencer.key'))
// };

// https.createServer(httpOptions, app).listen(443, () => {
//     logger.info('Listening on port 443');
// });

// http.createServer((req, res) => {
//     res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
//     res.end();
//     logger.info('Redirect ' + req.socket.remoteAddress);
// }).listen(80);

app.get('/', (req, res) => {
    res.redirect('app');
});

app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
    logger.info('Connection from ' + req.ip);
})

app.get('/howto', (req, res) => {
    res.sendFile(path.join(__dirname, '/howto.html'));
    logger.info('Served howto.html to ' + req.ip);
});

app.listen(80, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", 80);
 });
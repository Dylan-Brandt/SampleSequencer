const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 443;

app.use(express.static(path.join(__dirname, 'resources')));
app.use(express.urlencoded());

app.use(function(req, res, next) {
  if(!req.secure) {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  next();
});

const httpOptions = {
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem')),
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem'))
};

https.createServer(httpOptions, app).listen(port, () => {
  console.log(`Listening on port ${port}`);
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

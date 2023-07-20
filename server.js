const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3006;

app.use(express.static(path.join(__dirname, 'resources')));
app.use(express.urlencoded());

const httpOptions = {
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem')),
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem'))
};

https.createServer(httpOptions, app).listen(port, '10.0.0.169', () => {
  console.log(`Listening on port ${port}`);
})

// app.listen(port, "10.0.0.169" || "localhost" ,() => {
//     console.log(`Listening to requests on http://localhost:${port}`);
//   });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});
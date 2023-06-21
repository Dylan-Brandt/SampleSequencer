const express = require('express');

const app = express();

app.use(express.static(__dirname));
app.use(express.urlencoded());

app.listen(3006, () => {
    console.log('Server listening on port 3006');
});

app.get('/', (req, res) => {
    res.redirect('/index.html');
});
const express = require('express');
const app = express();
const path = require('path');

app.use('/files', express.static(path.join(__dirname, '/files')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/files/index.html'));
});

app.listen(3000);
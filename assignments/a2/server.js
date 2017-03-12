const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/img')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
    }
});

const upload = multer({ storage: storage });

// DB Stuff ***
const mongoose = require('mongoose');
const url = 'mongodb://alakerta:q1w2e3r4@mongodb9444-alakerta.jelastic.metropolia.fi/alakerta';
mongoose.connect(url).then(() => {
    console.log('Connected to Mongo');
    app.listen(3000);
}, () => {
    console.error('Connecting to Mongo failed');
});

const Schema = mongoose.Schema;
const spySchema = new Schema({
    id: Number,
    time: Date,
    title: String,
    details: String,
    coordinates: {
        lat: Number,
        lng: Number
    },
    thumbnail: String,
    image: String,
    original: String
});
const Spy = mongoose.model('Spy', spySchema);

// *** DB Stuff

app.use('/files', express.static(path.join(__dirname, '/files')));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/files/index.html'));
});

app.post('/new', upload.single('file'), (req, res, next) => {
    const data = req.body;
    const file = req.file;
    console.log(file);
    /*Spy.create(data).then(post => {
        res.send('Tallennus OK: ' + post.id);
    }).then(() => {
        res.send('Errorii.');
    });
    */
});

app.listen(3000);
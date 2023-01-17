const express = require('express');
const app = express();
const serv = require('http').Server(app);
const PORT = 3000;

app.use('/client', express.static(__dirname + '/client'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client');
});


app.listen(PORT);
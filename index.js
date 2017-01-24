var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var catchPhrases = ['xxxx', 'hahaha', '12345d', 'sdf;sdjf', 'lksjdflkkjahdf', 'esdfasdfasdf'];

app.set('view engine', 'pug');
app.set('view options', { layout: true });
app.set('views', __dirname + '/views');

app.get('/chat', function(req, res, next) {
    res.render('chat');
});

io.sockets.on('connection', function(socket) {
    var sendChat = function(title, text) {
        socket.emit('chat', {
            title: title,
            contents: text
        });
    };

    setInterval(function() {
        var randomIndex = Math.floor(Math.random() * catchPhrases.length)
        sendChat('Stooge', catchPhrases[randomIndex]);
    }, 5000);

    sendChat('welcome to the deepshit chat room', 'chat service is online');
    socket.on('chat', function(data) {
        sendChat('You', data.text);
    });
});

app.get('/stooge/:name?', function(req, res, next) {
    var name = req.params.name;

    switch (name ? name.toLowerCase() : '') {
        case 'larry':
        case 'curly':
        case 'moe':
            res.render('stooges', { stooge: name });
            break;

        default:
            next();
    }
});

app.get('/stooge', function(req, res) {
    res.render('stooges', { stooge: null });
});

app.get('/?', function(req, res) {
    res.render('index');
});

var port = 8000;
app.listen(port);
console.log('listening on port ' + port);
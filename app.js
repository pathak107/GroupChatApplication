var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);



app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log("Socket Connected");
  socket.on('messageSent', function (data) {
    io.emit('newMessage', { sender:data.sender,message: data.message });
  });
  socket.on('Typing', function (data) {
    socket.broadcast.emit('UserIsTyping', { sender:data.sender});
  });

  socket.on('join', function (user) {
    io.emit('UserJoined', user);
  });

  socket.on('disconnect', function () {
    console.log("disconnected")
    socket.broadcast.emit('user disconnected');
  });
});

server.listen(3000||process.env.PORT);
// WARNING: app.listen(80) will NOT work here!
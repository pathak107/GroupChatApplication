var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);



app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

//users in chat room 
var Users=[{
  id:String,
  name: String,
}];

function deleteUser(id){
  var i
  for(i=0;i<Users.length;i++)
  {
    if(Users[i].id===id) break;
  }
  Users.splice(i,1);
};

io.on('connection', function (socket) {
    console.log("Socket Connected");
  socket.on('messageSent', function (data) {
    io.emit('newMessage', { sender:data.sender,message: data.message });
  });
  socket.on('Typing', function (data) {
    socket.broadcast.emit('UserIsTyping', { sender:data.sender});
  });

  socket.on('join', function (user) {
    Users.push({id:socket.id,name:user});
    io.emit('UserJoined',Users);
  });

  socket.on('disconnect', function () {
    console.log("disconnected")
    deleteUser(socket.id);
    socket.broadcast.emit('user disconnected',Users);
  });
});

server.listen(3000||process.env.PORT);
// WARNING: app.listen(80) will NOT work here!
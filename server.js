var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket) {
  log('User connected');
  io.emit('userConnected', '');
  socket.on('disconnect', function() {
    io.emit('userDisconnected', '');
    log('User disconnected');
  });
});

http.listen(process.env.PORT || 8080, function(){
  log('Listening on port 8080');
})

app.get('/', function(req, res){
  res.send('You should not be here!');
})

function log(message) {
  console.log('[INFO]' + message);
}

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usersConnected = 0;
var currentTours = {};

io.on('connection', function(socket) {
  log('User connected');
  io.emit('updateStudentsConnected', ++usersConnected);

  socket.on('disconnect', function() {
    io.emit('updateStudentsConnected',--usersConnected);
    log('User disconnected');
  });

  socket.on('getAssets', function(msg){
    log('User requested current assent, sent back: ');
    io.emit('currentAsset', currentTours[msg]);
  });

  socket.on('setAsset', function(msg){
    log('Guide set asset to ' + msg);
    current
    io.emit('currentAsset')
  })

  socket.on('startTour', function(msg){
    log('Tour with pin ' + msg + ' has started');
    currentTours[msg] = 0;
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

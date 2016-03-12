var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usersConnected = 0;
var currentTours = {};

io.on('connection', function(socket) {
  l('User connected');
  io.emit('updateStudentsConnected', ++usersConnected);

  socket.on('disconnect', function() {
    io.emit('updateStudentsConnected',--usersConnected);
    l('User disconnected');
  });

  socket.on('getAssets', function(msg){
    l('User requested current assent, sent back: ');
    io.emit('currentAsset', currentTours[msg]);
  });

  socket.on('setAsset', function(msg){
    l('Guide set asset to ' + msg);
    // currentTou
    io.emit('currentAsset')
  })

  socket.on('startTour', function(msg){
    l('Tour with pin ' + msg + ' has started');
    currentTours[msg] = 0;
  });

});

http.listen(process.env.PORT || 8080, function(){
  l('Listening on port 8080');
})

app.get('/', function(req, res){
  res.send('You should not be here!');
})

function l(message) {
  console.log('[INFO]' + message);
}

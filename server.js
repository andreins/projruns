var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usersConnected = {};
var currentTours = {};
var pinz;

io.on('connection', function(socket) {
  socket.on('userConnected', function(pin) {
    l('User with pin ' + pin + ' connected!');
    if (!currentTours[pin]) {
      pinz = pin;
      usersConnected[pin] = -1;
      currentTours[pin] = [];
    }
    usersConnected[pin] += 1
    broadcast(pin, 'uc', usersConnected[pin]);
  });

  socket.on('startTour', function(pin) {
    l('Tour with pin ' + pin + ' has started');
  });

  socket.on('setAsset', function(key, assetID) {
    currentTours[key].push(assetID);
    broadcast(key, 'ga', assetID);
  });

  socket.on('sendAnswer', function(key, answer) {
    broadcast(key, 'ra', answer);
  });

  socket.on('publishQuestion', function(key, id) { 
    broadcast(key, 'pq', id);
  });

  socket.on('userDisconnected', function(msg) {
    l('User with pin ' + msg + ' disconnected!');
    usersConnected[msg] -= 1;
    broadcast(msg, 'uc', usersConnected[msg]);
    if(usersConnected[msg] === -1) {
      currentTours[msg] = null;
      usersConnected[msg] = null;
    }
  });

  socket.on('publishAnswer', function(pin) {
    io.emit(pin, 'pa');
    l('Publishing answer from tour with pin ' + pin);
  });

  socket.on('backPressed', function(pin) {
    l('Publishing answer from tour with pin ' + pin);
    io.emit(pin, 'back');
  });

  socket.on('disconnect', function() {
  });

  socket.on('getAssets', function(msg) {
    l('User requested current assent, sent back: ');
    io.emit('currentAsset', currentTours[msg]);
  });
});

http.listen(process.env.PORT || 8080, function() {
  l('Listening on port 8080');
});

app.get('/', function(req, res) {
  broadcast(pinz, 'ga', 1);
});

function broadcast(channel, key, message) {
  io.emit(channel, key, message)
  l('Broadcast - Channel ' + channel + ' - Key: '+ key + ' - Message: ' + message);

}

function l(message) {
  console.log('[INFO]' + message);
}

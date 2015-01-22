var express = require('express.io');
var app = express();
var path = require('path');
var port = 3000

// app setup
// istantiate Socket.IO magic
app.http().io();

// define assets directory
app.use(express.static(path.join(__dirname, 'public')));

// run the app
app.listen(port, function() {
	console.log('now listening on port: ' + port);
});

// app state machine
// this is stored in memory on the server
// Model
var info = {
	connectionCount: 0,
	currentPosition: {
		top: 0,
		left: 0
	}
};

// http routes
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

// Socket IO global events. This broadcast to all clients
var allSockets = app.io.sockets;

function addConnection() {
	info.connectionCount++;
	allSockets.emit('update', info);
	console.log('People connected (connected):' + info.connectionCount);
}

function removeConnection() {
	info.connectionCount--;
	allSockets.emit('update', info);
	console.log('People connected (disconnected):' + info.connectionCount);
}

// CONTROLLER

// 'connection' is an automatic event from Socket.io
// this is global. 
allSockets.on('connection', function(socket) {
	addConnection();
	// remove socket connection
	socket.on('disconnect', function() {
		removeConnection();
	});

});

// client routes
// app.io.route = client.on...
app.io.route('positionChange', function(req) {
	// assign new position to global
	info.currentPosition = req.data;

	console.log('Position changed to:' + info.currentPosition);

	// send new position to all clients
	allSockets.emit('update', info);
});


// OO version - to complex for this
/*var appInfoO = function() {}
appInfoO.prototype.connections = 0;
appInfoO.prototype.addConnection = function() {
	this.connections++;
}*/


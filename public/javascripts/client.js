$(function() {
	// UI
	var shapePosition = $('#shape-position');
	var shape = $('#shape').draggable({
		containment: '#container',
		scroll: false,
		// http://api.jqueryui.com/draggable/#event-drag
		drag: function(event, ui) {
			var pos = ui.position;
			
			console.log('Position changed to: ', pos);

			shapePosition.text(pos.top + ' : ' + pos.left);
			io.emit('positionChange', pos); // second argument is the req.data on the server
		}
	});
	var connectionCountElement = $('#connection-count');

	// listener
	io.on('update', function(info) {
		// View
		
		// show how many people are connected from 'connection'
		connectionCountElement.text(info.connectionCount);

		// change position to 'positionChange'
		var pos = info.currentPosition;
		shapePosition.text(pos.top + ' : ' + pos.left);

		shape.css({
			top: info.currentPosition.top,
			left: info.currentPosition.left
		});
	});
});


var obj = {}

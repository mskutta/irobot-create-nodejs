jQuery(function($) {
    var socket = io.connect();
    var $events = $('#events');
    var $forward = $('#forward');
    var $reverse = $('#reverse');
    var $left = $('#left');
    var $right = $('#right');
    var $stop = $('#stop');

    $forward.mousedown(function(e){
        e.preventDefault();
        socket.emit('command', 'forward');
    });

    $forward.mouseup(function(e){
        e.preventDefault();
        socket.emit('command', 'stop');
    });

    $reverse.mousedown(function(e){
        e.preventDefault();
        socket.emit('command', 'reverse');
    });

    $reverse.mouseup(function(e){
        e.preventDefault();
        socket.emit('command', 'stop');
    });

    $left.mousedown(function(e){
        e.preventDefault();
        socket.emit('command', 'left');
    });

    $left.mouseup(function(e){
        e.preventDefault();
        socket.emit('command', 'stop');
    });

    $right.mousedown(function(e){
        e.preventDefault();
        socket.emit('command', 'right');
    });

    $right.mouseup(function(e){
        e.preventDefault();
        socket.emit('command', 'stop');
    });

    $stop.mousedown(function(e){
        e.preventDefault();
        socket.emit('command', 'stop');
    });

    socket.on('event', function(data){
        $events.append(data + "<br/>");
    });
});
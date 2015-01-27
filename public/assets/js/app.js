var app = angular.module('app', []);

app.factory('socket', function($rootScope){
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

app.controller('controller', function($scope, socket) {

    $scope.events = [];

    socket.on('event', function(data){
        $scope.events.unshift({data: data});
        if ($scope.events.length > 100) {
            $scope.events.pop();
        }
    });

    $scope.forward = function(){
        socket.emit('command', 'forward');
    }
    $scope.left = function(){
        socket.emit('command', 'left');
    }
    $scope.stop = function(){
        socket.emit('command', 'stop');
    }
    $scope.right = function(){
        socket.emit('command', 'right');
    }
    $scope.reverse = function(){
        socket.emit('command', 'reverse');
    }
    $scope.home = function(){
        socket.emit('command', 'home');
    }
    $scope.play = function(){
        socket.emit('command', 'play');
    }
});

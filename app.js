var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    serialport = require("serialport"),
    SerialPort = serialport.SerialPort;

var serialPort = new SerialPort("COM6", {
    baudRate: 57600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flogControl: false,
    parser: serialport.parsers.readline("\r\n")
});

serialPort.on('open', serialPortOpen);
serialPort.on('data', serialPortData);
serialPort.on('close', serialPortClose);
serialPort.on('error', serialPortError);

// list serial ports:
serialport.list(function (err, ports) {
    ports.forEach(function(port) {
        console.log(port.comName);
    });
});

server.listen(3000);

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function(socket){
    socket.on('command', function(data){
        io.sockets.emit('event', data);
        console.log(data);
        switch(data){
            case 'stop':
                serialPort.write(new Buffer([145,0,0,0,0])); // Direct Drive Stop
                break;
            case 'forward':
                serialPort.write(new Buffer([137,0x00,0xC8,0x80,0x00]));
                break;
            case 'reverse':
                serialPort.write(new Buffer([137,0xFF,0x38,0x80,0x00]));
                break;
            case 'left':
                serialPort.write(new Buffer([137,0x00,0xC8,0x00,0x01]));
                break;
            case 'right':
                serialPort.write(new Buffer([137,0x00,0xC8,0xFF,0xFF]));
                break;
            case 'home':
                // Cover and Dock
                serialPort.write(new Buffer([136,1]));
                break;
            case 'play':
                // Start Safe Mode
                serialPort.write(new Buffer([128,131]));
                break;
        }
    });
});

function serialPortOpen() {
    console.log('port open. Data rate: ' + serialPort.options.baudRate);

    // Request data packet stream
    //serialPort.write(new Buffer([0x94,0x10,0x07,0x08,0x09,0x0A,0x0B,0x0C,0x0E,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1A,0x23]));
    serialPort.write(new Buffer([128,148,2,29,13]));
}

function serialPortData(data) {
    console.log(data);
}

function serialPortClose() {
    console.log('port closed.');
}

function serialPortError(error) {
    console.log('Serial port error: ' + error);
}

#!/usr/bin/env node
var bb = require('./bonescript');
var fs = require('fs');
var io = require('socket.io');
var pconfig = require('./processing-dynamic-view/bmp085-pressure');


setup = function() {
    var onconnect = function(socket) {
        console.log("New client connected");
        var pdelay = pconfig.pressureConfig.delay;
        var pscale = pconfig.pressureConfig.scale;
        
        var pfileData = pconfig.pressureConfig.file;

        var readData = function(fd) {
            fs.readFile(pfileData, function(err, data) {
                if(err) throw("Unable to read data: " + err);
                socket.emit('data', "" + data / pscale);
            });
            setTimeout(readData, pdelay);
        };

        socket.emit('pressureconfig', pconfig.pressureConfig);
        socket.emit('tempconfig', pconfig.tempConfig);
        setTimeout(readData, pdelay);

        // on message
        socket.on('message', function(data) {
            console.log("Got message from client:", data);
        });

        // on disconnect
        socket.on('disconnect', function() {
            console.log("Client disconnected.");
        });
    };
    var server = new bb.Server(8000, "processing-dynamic-view", onconnect);
    server.begin();
};

bb.run();

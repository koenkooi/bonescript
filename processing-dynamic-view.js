#!/usr/bin/env node
var bb = require('./bonescript');
var fs = require('fs');
var io = require('socket.io');
var pconfig = require('./processing-dynamic-view/bmp085-pressure');
var tconfig = require('./processing-dynamic-view/bmp085-temp');


setup = function() {
    var onconnect = function(socket) {
        console.log("New client connected");
        var delay = pconfig.dynviewConfig.delay;
        var pscale = pconfig.dynviewConfig.scale;
        
        var pfileData = pconfig.dynviewConfig.file;

        var readData = function(fd) {
            fs.readFile(pfileData, function(err, data) {
                if(err) throw("Unable to read data: " + err);
                socket.emit('data', "" + data / pscale);
            });
            setTimeout(readData, delay);
        };

        socket.emit('config', pconfig.dynviewConfig);
        setTimeout(readData, delay);

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

#!/usr/bin/env node
var bb = require('./bonescript');
var fs = require('fs');
var io = require('socket.io');


setup = function() {
    var onconnect = function(socket) {
        console.log("New client connected");

        // on message
        socket.on('message', function(data) {
            console.log("Got message from client:", data);
        });

        // on disconnect
        socket.on('disconnect', function() {
            console.log("Client disconnected.");
        });
    };
    
    var server6 = new bb.Server6(8001, "schmux", onconnect);
    server6.name = 'ipv6server'
    server6.begin();
    
    var server = new bb.Server(8001, "schmux", onconnect);
    server.name = 'ipv4server'
    server.begin();
};

bb.run();

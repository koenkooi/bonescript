var bb = require('./bonescript');

setup = function() {
    var server = new bb.Server(80, "ELC2012-koen");
    server.begin();
};

bb.run();

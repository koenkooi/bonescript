$(document).ready(function() {
    //setup socket.io-client
    var socket = new io.connect(); 

    //setup handler for receiving the strict with all the expansion pins from the server
    socket.on('adcdata', function (data) {
        // data is in volts
        $("#ADC").html("Analog In 1: " + data + " Volt");
    });

})

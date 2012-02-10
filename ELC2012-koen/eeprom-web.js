$(document).ready(function() {
    //setup socket.io-client
    var socket = new io.connect(); 

    //setup handler for receiving the strict with all the expansion pins from the server
    socket.on('eeproms', function (data) {
        eeproms = data;
        var boneversion = eeproms['/sys/bus/i2c/drivers/at24/1-0050/eeprom'].version;
        var boneserial = eeproms['/sys/bus/i2c/drivers/at24/1-0050/eeprom'].serialNumber;

        var bonestring = "BeagleBone " + boneversion + "<br/>";
        bonestring += "Serial number: " + boneserial + "<br/>";

        if(eeproms['/sys/bus/i2c/drivers/at24/3-0054/eeprom']) {
            cape1name = eeproms['/sys/bus/i2c/drivers/at24/3-0054/eeprom'].boardName;
            bonestring += "Cape address 0x54: " + cape1name + "<br/>";

        }
        if(eeproms['/sys/bus/i2c/drivers/at24/3-0055/eeprom']) {
            cape2name = eeproms['/sys/bus/i2c/drivers/at24/3-0055/eeprom'].boardName;
            bonestring += "Cape address 0x55: " + cape2name + "<br/>";
            for (pin in eeproms['/sys/bus/i2c/drivers/at24/3-0055/eeprom'].mux){
                if(eeproms['/sys/bus/i2c/drivers/at24/3-0055/eeprom'].mux[pin].used == "used") {
                    bonestring += pin + " " + eeproms['/sys/bus/i2c/drivers/at24/3-0055/eeprom'].mux[pin].function + "<br/>";
                }
            }
        }
        if(eeproms['/sys/bus/i2c/drivers/at24/3-0056/eeprom']) {
            cape3name = eeproms['/sys/bus/i2c/drivers/at24/3-0056/eeprom'].boardName;
            bonestring += "Cape address 0x56: " + cape3name + "<br/>";
        }
        if(eeproms['/sys/bus/i2c/drivers/at24/3-0057/eeprom']) {
            cape4name = eeproms['/sys/bus/i2c/drivers/at24/3-0057/eeprom'].boardName;
            bonestring += "Cape address 0x57: " + cape4name + "<br/>";
        }
            
        $("#eeprom").html(bonestring);
    });

})

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

        bonestring += printPin(eeproms, '/sys/bus/i2c/drivers/at24/3-0054/eeprom');
        bonestring += printPin(eeproms, '/sys/bus/i2c/drivers/at24/3-0055/eeprom');
        bonestring += printPin(eeproms, '/sys/bus/i2c/drivers/at24/3-0056/eeprom');
        bonestring += printPin(eeproms, '/sys/bus/i2c/drivers/at24/3-0057/eeprom');

            
        $("#eeprom").html(bonestring);
    });

})

function printPin(eeproms, eeprom) {
    var pinString = "";
    address = eeprom.split("/")[6].substr(4);
	if(eeproms[eeprom]) {
        cape2name = eeproms[eeprom].boardName;
        pinString += "Cape address 0x" + address + ": " + cape2name + "<br/>";
        $('#cape' + address).svg({onLoad: drawBone});
        for (pin in eeproms[eeprom].mux){
            if(eeproms[eeprom].mux[pin].used == "used") {
                //pinString += pin + " " + eeproms[eeprom].mux[pin].function + "<br/>";
                colourPin($('#cape' + address).svg('get'), pin);
            }
        }        
    }
    return pinString;
}

var scale = 4;
var radius1 = 25.4/4 * scale;
var radius2 = 25.4/2 * scale;
var bottomside = (2.15 * 25.4) * scale - 2 * radius2;
var topside = (2.15 * 25.4) * scale - 2 * radius1;
var largeside = (3.4 * 25.4) * scale - radius1 - radius2;

function drawBone(svg) {
    var beaglebonesvg = svg.group("beaglebone");
    var path = svg.createPath(); 

    svg.path(beaglebonesvg, path.move(radius1,0,false).
    line(topside, 0,true).arc(radius1, radius1, 90, false, true, radius1, radius1, true).
    line(0, largeside, true).arc(radius2, radius2, -90, false, true, -radius2, radius2,true).
    line(-bottomside, 0, true).arc(radius2, radius2, 90, false, true, -radius2, -radius2,true).
    line(0, -largeside, true).arc(radius1, radius1, 90, false, true, radius1, -radius1, true)
    .close(),  
    {fill: '#fafafa', stroke: '#000000', strokeWidth: 1});
    svg.rect(beaglebonesvg, 0, 18 * scale,5 * scale, 58 * scale, {fill: '#fafafa', stroke: '#000000', strokeWidth: 1}); //P9
    svg.rect(beaglebonesvg, bottomside + 2 * radius2 - 5*scale, 18 * scale,5 * scale, 58 * scale, {fill: '#fafafa', stroke: '#000000', strokeWidth: 1}); //P8
    for (i=0;i<=22;i++) {
        //P9
        svg.rect(beaglebonesvg, scale/3, 18.5 * scale + 2.5 * i * scale, 2 * scale, 2 * scale,{fill: '#cdcdcd'});
        svg.rect(beaglebonesvg, 2.6*scale,18.5 * scale + 2.5 * i * scale, 2 * scale, 2 * scale,{fill: '#cdcdcd'});
    }
    for (i=0;i<=22;i++) {
        //P8
        svg.rect(beaglebonesvg, scale/3 + bottomside + 2 * radius2 - 5*scale, 18.4 * scale + 2.5 * i * scale, 2 * scale, 2 * scale,{fill: '#cdcdcd'});
        svg.rect(beaglebonesvg, 2.6*scale + bottomside + 2 * radius2 - 5*scale,18.4 * scale + 2.5 * i * scale, 2 * scale, 2 * scale,{fill: '#cdcdcd'});
    }
    //colourPin(svg, "P9_2");
}

function colourPin(svg, pin) {
	var beaglebonesvg = svg.group("beaglebone");
    var connector = pin.substr(0,2);
	var pinnumber = pin.substr(3);
	
	var i = Math.ceil(pinnumber/2) - 1;
	var carry = pinnumber % 2;
	
	if(connector == "P8") {
		if(carry == 1){
			svg.rect(beaglebonesvg,   scale/3 + bottomside + 2 * radius2 - 5*scale, 18.4 * scale + 2.5 * i * scale, 2 * scale, 2 * scale,{fill: '#000000'});
		} else {
			svg.rect(beaglebonesvg, 2.6*scale + bottomside + 2 * radius2 - 5*scale, 18.4 * scale + 2.5 * i * scale, 2 * scale, 2 * scale,{fill: '#000000'});
		}
	}
	if(connector == "P9") {
		if(carry == 1) {
			svg.rect(beaglebonesvg, scale/3, 18.5 * scale + 2.5 * i * scale, 2 * scale, 2 * scale,{fill: '#000000'});
		} else {
			svg.rect(beaglebonesvg, 2.6*scale,18.5 * scale + 2.5 * i * scale, 2 * scale, 2 * scale,{fill: '#000000'});	
		}
	}
}
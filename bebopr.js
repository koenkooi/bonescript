#!/usr/bin/env node

var bb = require('bonescript');
var fs = require('fs');
var io = require('socket.io');

var tempLUT = 
{
    4095: -217,
    3637: -55,
    3637: -40,
    3633: -25,
    3617: 0,
	3612: 5,
	3604: 10,
	3595: 15,
	3584: 20,
	3571: 25,
	3555: 30,
	3536: 35,
	3513: 40,
	3486: 45,
	3455: 50,
	3419: 55,
	3377: 60,
	3330: 65,
	3276: 70,
	3216: 75,
	3149: 80,
	3075: 85,
	2994: 90,
	2907: 95,
	2814: 100,
	2715: 105,
	2612: 110,
	2504: 115,
	2393: 120,
	2279: 125,
	2164: 130,
	2049: 135,
	1935: 140,
	1822: 145,
	1711: 150,
	1604: 155,
	1500: 160,
	1400: 165,
	1305: 170,
	1215: 175,
	1130: 180,
	1049: 185,
	974: 190,
	904: 195,
	838: 200,
	777: 205,
	720: 210,
	668: 215,
	619: 220,
	574: 225,
	532: 230,
	494: 235,
	459: 240,
	396: 250,
	369: 255,
	343: 260,
	298: 270,
	278: 275,
	260: 280,
	243: 285,
	227: 290,
	212: 295,
	199: 300,
}
tempLUT.sort;

var ainArray = new Array();
ainArray[2] = new Array();
ainArray[4] = new Array();
ainArray[6] = new Array();

ainTemp = new Array();

var m = new Array();
m[2] = 0; m[4] = 0 ; m[6] = 0;

var inputPinAIN2 = bone.P9_40;
var inputPinAIN4 = bone.P9_38;
var inputPinAIN6 = bone.P9_36;

pwmRead = exports.pwmRead = function(pin, callback) {
    if(!pin.pwm) {
        throw(pin.key + ' does not support pwmRead()');
    }
    var path = '/sys/class/pwm/' + pin.pwm.path;
    if(callback) {
        var readFile = function(err, data) {
            callback({'freq':data/100});
        };
        fs.readFile(path+'/duty_percent', readFile);
        return(true);
    }
    return(fs.readFileSync(path+'/duty_percent')/100);
};

function fancyAverage(numbers) {
    // Sort the array so we know which elements are the max and min values.
    numbers.sort();

    // sum the values, but throw away the maximum and minimum values
    for(var i=1,sum=0;i<(numbers.length - 1);sum+=numbers[i++]);

    // Average and round to 2 decimals
    fancyAveragenumber = Math.round(100*sum/(numbers.length -2))/100;

    return fancyAveragenumber;
}


function readAIN(inputPin, ainIndex) {
    var temp;
    var prevLUT = 4096;
    var value;

    n = m[ainIndex];

    ainArray[ainIndex][n] = analogRead(inputPin) * 4096;
    m[ainIndex]++;
    // limit to 4 samples
    if(n>3) {
        value = fancyAverage(ainArray[ainIndex]);
        for(var x in tempLUT) {
            if(value > prevLUT && value < x) {
                lutInterval = x - prevLUT ;
                lutValueInterval = tempLUT[x] - tempLUT[prevLUT];
                //console.log("AIN" + ainIndex + " value " + value + " is in between " + prevLUT + "->" + tempLUT[prevLUT] + "  and " + x + "->" + tempLUT[x]);
                ainTemp[ainIndex] = Math.round((tempLUT[prevLUT] + ((value - prevLUT)/lutInterval) * lutValueInterval)*10)/10;
            }
        prevLUT = x;    
        }
        //console.log("Interpolated temperature for AIN" + ainIndex + ": " + ainTemp[ainIndex] + "°C");
        return
    }
    setTimeout(function() {readAIN(inputPin, ainIndex); }, 10);
}


setup = function() {
    var onconnect = function(socket) {
        console.log("New client connected");
        
        // PWM changes
        socket.on('pwmdutypercent', function(data) {
            pwm = data[0];
            pwmvalue = data[1] / 100;
            switch(pwm) {
                case 0:
                    analogWrite(bone.P8_46, pwmvalue);
                    break;
                case 1:
                    analogWrite(bone.P8_45, pwmvalue);
                    break;
                case 2:
                    analogWrite(bone.P9_14, pwmvalue);
                    break;
            }
            console.log("PWM" + pwm + ": " + pwmvalue);
        });

        socket.on('getTemp', function() {
            readAIN(inputPinAIN2, 2);
            readAIN(inputPinAIN4, 4);
            readAIN(inputPinAIN6, 6);
            socket.emit('ain', ainTemp);
        });
        
        socket.on('getPWM', function() {
            pwm2duty = pwmRead(bone.P8_46) * 100;
            pwm4duty = pwmRead(bone.P8_45) * 100;
            pwm6duty = pwmRead(bone.P9_14) * 100;
            socket.emit('PWM', [pwm2duty, pwm4duty, pwm6duty]);
        });

        // on disconnect
        socket.on('disconnect', function() {
            console.log("Client disconnected.");
        });
    };
    
    var server = new bb.Server(4002, "bebopr", onconnect);
    server.name = 'bebopr';
    server.begin();
};

loop = function() {
//    readAIN(inputPinAIN2, 2);
//    readAIN(inputPinAIN4, 4);
//    readAIN(inputPinAIN6, 6);
//    delay(5000);
}

bb.run();


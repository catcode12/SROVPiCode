var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var pwmpins= [4,17,27];
var motors = [];
var values = [];
var pi = false;
pwmpins.forEach((pin,index) => values[index]=0); //0 all the values
if(pi){
var Gpio = require('pigpio').Gpio; //include pigpio to interact with the GPIO}
pwmpins.forEach((pin,index) => 
motors[index] = new Gpio(pin, {mode: Gpio.OUTPUT})); //use GPIO pins as output for the motors
//RESET RGB LED
motors.forEach((motor) => motor.digitalWrite(0)) // Turn the motors off
}
http.listen(8081); //listen to port 8080

function handler (req, res) { //what to do on requests to port 8080
  if(req.url == "/public/socket.js"){
    fs.readFile(__dirname + req.url, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
    });
  } else {
fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file rgb.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from rgb.html
    return res.end();
  });
}
}

io.sockets.on('connection', function (socket) {// Web Socket Connection
  socket.on('sliderValues', function(data) { //get motor status from client
   console.log(data);

    //for the motors 0 is fully off, and 255 is fully on
    values.forEach((element, index) => element=parseInt(data[index]));
    //sets all the values to what the client sends


if(pi){
   //set the motors actual speed
    motors.forEach((motor, index) => motor.pwmWrite(values[index]));
}
});
});

process.on('SIGINT', function () { //on ctrl+c
if(pi){
  motors.forEach((motor) => motor.digitalWrite(0));  //stops all the motors
}
  process.exit(); //exit completely
}); 

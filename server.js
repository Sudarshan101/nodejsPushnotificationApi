var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var multer  =   require('multer');
var methodOverride = require('method-override');
var http = require('http');
// =======================
// configuration =========
// =======================


var port = process.env.PORT || 8258;

app.use(express.static(__dirname + '/public'));
app.use('/public/uploads',express.static(__dirname + '/public/uploads'));
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Send Push Notification
app.post('/sendpush', function(req, res) {
    var registration_ids = [];
    registration_ids.push('d-QgyDvswI8:APA91bFtzMIqxEl-gQAYrAwZx2iMAwsXe_69rFhBkcSfAVkewEtqV5G7buCmXKcy68InCQGC-t0VELTs2ZdnmyzFD_7FFZ41upkAQDcZTxYGOTFqujXndbKiTM7j1d2ylfZyoh2GGv4D');
      
    var data = {
      "collapseKey":"applice",
      "delayWhileIdle":true,
      "timeToLive":3,
      "data":{
        "message": "Sent Notification","title":"Push Notification"
        },
      "registration_ids":registration_ids
    };

    var dataString =  JSON.stringify(data);
    var headers = {
      'Authorization' : 'key=<you Api Key>',
      'Content-Type' : 'application/json',
      'Content-Length' : dataString.length
    };
    var options = {
      host: 'android.googleapis.com',
      port: 80,
      path: '/gcm/send',
      method: 'POST',
      headers: headers
    };

    //Setup the request 
    var req = http.request(options, function(res) {
      res.setEncoding('utf-8');

      var responseString = '';

      res.on('data', function(data) {
        responseString += data;
      });

      res.on('end', function() {
        var resultObject = JSON.parse(responseString);
      });
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));

    });
    req.on('error', function(e) {
      console.log('error : ' + e.message + e.code);
    });
    req.write(dataString);
    req.end();
    res.send();
});


// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Running at ' + port);

require('dotenv').config();

const BinaryServer = require('binaryjs').BinaryServer;
const fs = require('fs');
const wav = require('wav');
const Speech = require('@google-cloud/speech');
const NLP = require('@google-cloud/language');
const speech = Speech({
  //projectId: process.env.GCLOUD_PROJECT,
  //keyFilename: process.env.GCLOUD_KEY_FILE 
});

const nlp = NLP({
  //projectId: process.env.GCLOUD_PROJECT,
  //keyFilename: process.env.GCLOUD_KEY_FILE 
});

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var outFile = 'recording.wav';


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

binaryServer = BinaryServer({port: 9001});

binaryServer.on('connection', function(client) {
  console.log('new connection');

  var fileWriter = new wav.FileWriter(outFile, {
    channels: 2,
    sampleRate: 44100, //48000
    bitDepth: 16
  });

  client.on('stream', function(stream, meta) {
    console.log('new stream');
   
    //8kHz = 8000Hertz = phone quality
    //44.1 kHz, 16bit = browser getUserMedia

    const request = {
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 44100, //48000
        languageCode: 'en-US'
        //languageCode: 'nl-NL'
      }
      //interimResults: true
      //,single_utterance: true
    };

  console.log(request);

  var obj = {};

  /*speech.longRunningRecognize(request)
    .then((results) => {
      const operation = results[0];
      // Get a Promise representation of the final result of the job
      return operation.promise();
    })
    .then((results) => {
      const transcription = results[0].results[0].alternatives[0].transcript;
      console.log(`Transcription: ${transcription}`);
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });*/

  // Create a recognize stream
  const recognizeStream = speech.streamingRecognize(request)
    .on('error', console.error)
    .on('data', function(data) {
    
      console.log(data);

      if(data.results){

        //detect sentiment here

        //if sentiment is < 0.5 than red

        console.log(data.results && data.results[0].alternatives);

        obj = {
          msg: data.results[0].alternatives[0].transcript,
        };

        console.log(data.results[0]);

        console.log(obj.msg);
      }
    });

    stream.pipe(fileWriter);
    stream.pipe(recognizeStream);

    stream.on('end', function(data) {
      fileWriter.end();
      console.log(data);
      console.log('wrote to file ' + outFile);

      //MAKE A CALL TO SENTIMENT
      client.send(obj);

      /*const document = nlp.document({ content: obj.msg });
      document.detectSentiment().then(function(data) {
        var sentiment = data[0];
        var apiResponse = data[1];

        console.log(sentiment, apiResponse);

        obj.color = "red";
        obj.sentiment = sentiment.score;

        client.send(obj);
      }).catch((err) => {
        console.error('ERROR:', err);
        obj.color = "";
        obj.sentiment = 1;

        client.send(obj);    
      });*/

    });
  });
});


module.exports = app;

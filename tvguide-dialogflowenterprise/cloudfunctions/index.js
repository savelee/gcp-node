'use strict';

var request = require('request');
var { WebhookClient } = require('dialogflow-fulfillment');
const {
    dialogflow,
    Suggestions,
    BasicCard,
    Button,
    SimpleResponse,
  } = require('actions-on-google');

exports.tvguide = function(request, response){
    const agent = new WebhookClient({ request, response });
    
    const CHANNEL_INTENT = 'Channel Intent';
    const TEST_INTENT = "Test Intent";

    let conv = agent.conv(); // Get Actions on Google library conv instance
    intentMap.set(TEST_INTENT, testHandler);
    if(conv != null){
        console.log("Google Assistant answers:");
        let intentMap = new Map();
        intentMap.set(CHANNEL_INTENT, googleAssistantHandler);
        agent.handleRequest(intentMap);
    } else {
        console.log("Bot answers:");
        let intentMap = new Map();
        intentMap.set(CHANNEL_INTENT, botHandler);
        agent.handleRequest(intentMap);
    }
}

function testHandler(agent){
    console.log("test handler");
    let conv = agent.conv();
    conv.ask('Hi from the Actions on Google client library');
    agent.add(conv);
    conv.close("bye");
}

function botHandler(agent) {
    const CHANNEL_PARAM = 'channel';
    var c = agent.parameters[CHANNEL_PARAM];
    agent.ask("Hallo");
    agent.add("Hallo2");
    getTvProgramByChannel(c, function(response){
        //TODO instead of calling out everything
        //READ 2 lines.
        console.log("start callback bot");
        agent.add("Hi!");
        agent.add(response[0].titel);
        agent.ask(response[0].titel);
        agent.close("bye");
    });
}

function googleAssistantHandler(agent) {
    const CHANNEL_PARAM = 'channel';
    var c = agent.parameters[CHANNEL_PARAM];

    getTvProgramByChannel(c, function(response){
        console.log("start callback ga");
        let conv = agent.conv(); // Get Actions on Google library conv instance
        agent.add(response[0].titel);
        //conv.ask()
        conv.close(response[0].titel); // Use Actions on Google library
        agent.add(conv); // Add Actions on Google library responses to your agent's response    
    });
}


//map with day possibilities to say
var DAYS = new Map([
   [ "today", 0 ],
   [ "tomorrow", 1 ]
]);

Map.prototype.getKeyByValue = function( value ) {
    for (var key of this.entries()) {
        if(key[1] === value) return key[0];
    }
 }

const dates = {
   convert:function(d) {
       return (
           d.constructor === Date ? d :
           d.constructor === Array ? new Date(d[0],d[1],d[2]) :
           d.constructor === Number ? new Date(d) :
           d.constructor === String ? new Date(d) :
           typeof d === "object" ? new Date(d.year,d.month,d.date) :
           NaN
       );
   },
   compare:function(a,b) {
       return (
           isFinite(a=this.convert(a).valueOf()) &&
           isFinite(b=this.convert(b).valueOf()) ?
           (a>b)-(a<b) :
           NaN
       );
   },
   inRange:function(d,start,end) {
      return (
           isFinite(d=this.convert(d).valueOf()) &&
           isFinite(start=this.convert(start).valueOf()) &&
           isFinite(end=this.convert(end).valueOf()) ?
           start <= d && d <= end :
           NaN
       );
   }
}

const makeRequest = function(url, callback){
   request(url, function (error, response, body) {
       if(response && response.statusCode == 200){
           var data = JSON.parse(body);
           var result;
           for (var key in data) {
                result = data[key];
                break;
           }
           callback(result);  
       }
    });
};


const getTvProgramByChannel = function(channel_input, cb){
   let days_input = 0; //TODO
   let url = `https://us-central1-leeboonstra-blogdemos.cloudfunctions.net/tvguidefeed?channels=${channel_input}&days=${days_input}`;
   //https://us-central1-leeboonstra-blogdemos.cloudfunctions.net/tvguidefeed?channels=4&days=0
   
   makeRequest(url, cb);
}

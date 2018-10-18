//https://us-central1-leeboonstra-blogdemos.cloudfunctions.net/tvguidefeed?channels=4&days=0
  
'use strict';

const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const rp = require('request-promise');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.tvguide = function(request, response){
  //console.log("version 1");
  var agent = new WebhookClient({ request, response });
  //console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  //console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  var body = JSON.stringify(request.body);
  var channel_reply = "";

  var channel_input = request.body.queryResult.parameters.channel;
  let days_input = 0; //TODO
  let url = `https://us-central1-leeboonstra-blogdemos.cloudfunctions.net/tvguidefeed?channels=${channel_input}&days=${days_input}`;
  
  var options = {
      uri: url,
      json: true
  };
   
  rp(options)
      .then(function (data) {
          var result;
          for (var key in data) {
              result = data[key];
              break;
         }
        console.log(result);
        channel_reply = programReader(result, channel_input, agent.locale);
      })
      .catch(function (err) {
        channel_reply = "Ik kan helaas geen zender informatie opvragen.";
      })
      .finally(function(){
        let intentMap = new Map();
        intentMap.set('Test Intent', testHandler);
        intentMap.set('Channel Intent', channelHandler);
        
        agent.handleRequest(intentMap);
      });

  function testHandler(agent) {
    agent.add(`Dit is een test.`);
  }
  function channelHandler(agent) {
    agent.add(channel_reply);
  }
};

const getNiceHours = function(hour){
    if(hour >= '12'){
        hour = (hour - 12);
    }
    return hour;
};

const getNiceMin = function(min){
    if(min == '00' || '0'){
        min = "";
    } else {
        min = " " + min;
    }
    return min;
};

const getChannelName = function(channel){
    var channels = new Map();
    channels.set('1', 'Nederland 1');
    channels.set('2', 'Nederland 2');
    channels.set('3', 'Nederland 3');
    channels.set('4', 'RTL 4');
    channels.set('25', 'MTV');
    channels.set('31', 'RTL 5');
    channels.set('37', 'Net 5');
    channels.set('46', 'RTL 7');
    channels.set('92', 'RTL 8');

    return channels.get(channel);
}

const programReader = function(channelInfo, channel, locale){
    var speak = "";

    var d = new Date();
    var myHour = d.getHours();
    var myMin = d.getMinutes();
    var mySec = d.getSeconds();

    var i=0; var total = channelInfo.length;
    for (i; i<=total; i++){
        var programDateStr = channelInfo[i]['datum_start'];
        var programNextDateStr = channelInfo[i+1]['datum_start'];
        var pDate = new Date(programDateStr);
        var nDate = new Date(programNextDateStr);
        
        if(pDate.getHours() >= myHour){
            console.log(channelInfo[i]);
            console.log(channelInfo[i+1]);

            if(locale == 'nl'){
                speak = "Op " + getChannelName(channel) + ". <break time='200ms'/>";
                if(pDate.getMinutes > myMin){
                    speak = speak + "Om " + getNiceHours(pDate.getHours()) + " uur" + getNiceMin(pDate.getMinutes()) +
                    ": " + channelInfo[i].titel + ". ";
                } else {
                    speak = speak + "Sinds " + getNiceHours(pDate.getHours()) + " uur" + getNiceMin(pDate.getMinutes()) +
                    ": " + channelInfo[i].titel + ". ";
                }
                speak = speak + "Daarna om " + getNiceHours(nDate.getHours()) + " uur" + getNiceMin(nDate.getMinutes()) +
                ": " + channelInfo[i+1].titel + ".";
                break;
            }
            if(locale == 'en'){
                speak = "On " + getChannelName(channel) + ". <break time='200ms'/>";
                if(pDate.getMinutes > myMin){
                    speak = speak + "At " + getNiceHours(pDate.getHours()) + " " + getNiceMin(pDate.getMinutes()) +
                    ": " + channelInfo[i].titel + ". ";
                } else {
                    speak = speak +  "Since " + getNiceHours(pDate.getHours()) + " " + getNiceMin(pDate.getMinutes()) +
                    ": " + channelInfo[i].titel + ". ";
                }
                speak = speak + "Afterwards at " + getNiceHours(nDate.getHours()) + " " + getNiceMin(nDate.getMinutes()) +
                ": " + channelInfo[i+1].titel + ".";
                break;              
            }
        }
    }

    return speak;
}
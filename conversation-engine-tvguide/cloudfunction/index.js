'use strict';

process.env.DEBUG = 'actions-on-google:*';

const request = require('request');
const Assistant = require('actions-on-google').ApiAiApp;

var CHANNELS = new Map([
   ["Nederland 1", 1],
   ["Nederland 2", 2],
   ["Nederland 3", 3],
   ["RTL 4", 4],
   ["RTL 5", 31],
   ["RTL 7", 46],
   ["RTL 8", 92],
   ["SBS 6", 36],
   ["Net 5", 37],
   ["MTV", 25]
]);

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

const makeRequest = function(url, key, callback){
   request(url, function (error, response, body) {
       if(response && response.statusCode == 200){
           var data = JSON.parse(body);
           var info = []; //contains all tvguide info
               //console.log(data);
               var channel = data[key];
         	    
               if(channel) {
                   var channel_name = CHANNELS.getKeyByValue(parseInt(key));
                   if(channel_name.length <= 5) channel_name =  '<say-as interpret-as="characters">' + channel_name.split(' ')[0] + '</say-as> ' + channel_name.split(' ')[1];
                   info.push('<s>On: ' + channel_name +  '</s><break time="3s"/>');

                   console.log(channel);

                   //loop through all programs
                   //Unfortunately the API returns
                   //sometimes objects and sometimes arrays
                   if(channel instanceof Array){
                       for(var program of channel){
                           //console.log(program);
                           var programinfo = getProgramInfo(program);
                           console.log(programinfo);
                           if(programinfo) info.push(programinfo);
                       }
                   } else {
                       for(var program in channel){
                           //console.log(channel[program]);
                           var programinfo = getProgramInfo(channel[program]);
                           console.log(programInfo);
                           if(programinfo) info.push(programinfo);
                       }
                   }

               } else {
                  callback('<speak><s>Unfortunately, I am not able to retrieve the tv guide.</s></speak>');
               }
           

           var str = info.join('. </s><break time="1"/>');
           callback('<speak>' + str + '</speak>');
       
       } else {
           callback('<speak><s>Unfortunately, I am not able to retrieve the tv guide.</s></speak>');
       }
   });
};

const getProgramInfo = function(program){
   var time = "", nicetime = "";
   var currentTime = new Date();
   var myDate = new Date(program.datum_start);
   time = myDate.getHours();
   if(myDate.getHours() > 12) {
       nicetime = myDate.getHours() - 12;
       if(myDate.getMinutes() > 0) nicetime = nicetime + ":" + myDate.getMinutes();
       nicetime = nicetime + "pm";
   } else {
       nicetime = myDate.getHours();
       if(myDate.getMinutes() > 0 && myDate.getMinutes() < 10) {
           nicetime = nicetime + ":0" + myDate.getMinutes();
       } else if(myDate.getMinutes() > 0) {
           nicetime = nicetime + ":" + myDate.getMinutes();
       }
       nicetime = nicetime + "am";
   }
   
   //only mention upcoming programs
   //if(dates.compare(myDate, currentTime) == 1)  
   return "<s>At <say-as interpret-as='time' format='hms12'>" + nicetime + "</say-as> " + program.titel;
}

const getTvProgramByChannel = function(assistant){
   let channel = assistant.getArgument('channel');
   let channel_input = CHANNELS.get(channel);
   let days_input = 0; //TODO
   let url = `https://us-central1-leeboonstra-blogdemos.cloudfunctions.net/tvguidefeed?channels=${channel_input}&days=${days_input}`;

   console.log("program by channel: " + channel);
   console.log(url);

   makeRequest(url, channel_input, function(text){
       console.log("!!!text: ");
       console.log(text);
       assistant.tell(text);
   });
}

exports.tvguide = function (req, res){
   const assistant = new Assistant({request: req, response: res});

   const actionMap = new Map();
   actionMap.set('GET_BY_CHANNEL', getTvProgramByChannel);
   
   assistant.handleRequest(actionMap);
}
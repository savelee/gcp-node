const DLP = require('@google-cloud/dlp');
const BQ = require('@google-cloud/bigquery');
const Speech = require('@google-cloud/speech');
const Translate = require('@google-cloud/translate');
const Language = require('@google-cloud/language');

const transcribeAudio = function(uri){

    console.log(uri);

    var client = Speech();
    var languageCode = 'en-US';
    var sampleRateHertz = 16000;
    var config = {
        languageCode : languageCode,
        sampleRateHertz : sampleRateHertz,
        encoding : 'LINEAR16'
    };
    var audio = {
        uri : uri
    };
    var request = {
        config: config,
        audio: audio
    };
    client.recognize(request).then(function(responses) {
        var text = responses[0].results[0].alternatives[0].transcript;

        console.log("1:" + text);

        Promise.all([
            redactText(text), 
            getTranslation(text), 
            getSentiment(text), 
            saveTextBQ(text)]
        ).then(values => { 
            console.log("FINAL RESULTS");
            console.log(arguments);
            for(key in arguments){
                console.log(key);
                console.log(arguments[key].results[0].items[0].value);
            }
        }).catch(function(err) {
            throw err;
        }); 

    })
    .catch(function(err) {
        console.error(err);
    });
      
}

const redactText = function(text){
    const dlp = DLP();

    const infoTypes = [
        { name: 'EMAIL_ADDRESS' }, 
        { name: 'IP_ADDRESS'}
    ];
    const items = [
        { type: 'text/plain', value: text }
    ];

    const replaceConfigs = infoTypes.map((infoType) => {
        return {
            infoType: infoType,
            replaceWith: "REDACTED"
        };
    });

    const request = {
        inspectConfig: {
            infoTypes: infoTypes,
            minLikelihood: 'LIKELIHOOD_UNSPECIFIED'
        },
        items: items,
        replaceConfigs: replaceConfigs
    };

    return dlp.redactContent(request);
}

const getTranslation = function(results){
    //TODO
    return results;
}

const getSentiment = function(results){
    //TODO
    return results;
}

const saveTextBQ = function(results){
    //TODO
    return results;
}


exports.processFile = function videoapi(event, callback){
    var d = event.data;
    console.log(d);
    if(
        d.contentType == "application/octet-stream" ||
        d.contentType == "audio/x-flac"  
    ){
        console.log("let's transcribe");
        transcribeAudio("gs://" + d.bucket + "/" + d.name);
    }
}
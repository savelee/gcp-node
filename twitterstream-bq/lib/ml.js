//require the google-cloud npm package
//setup the API keyfile, so your local environment can
//talk to the Google Cloud Platform
const gcloud = require('google-cloud')({
  projectId: process.env.GCLOUD_PROJECT,
  keyFilename: process.env.GCLOUD_KEY_FILE
});

//We will make use of the language() and translate() 
//GCP machine learning APIs
const language = gcloud.language();
const translate = gcloud.translate();

//get language translation, pass in a text and a callback function
//translate() gets an object with the "from" and "to"
//settings. It will return the translated language string.
var getTranslation = function(text, callback){
    translate.translate(text, { 
        from: 'nl', to: 'en'
    }, function(err, translation) {
        if (!err) {
            //console.log(translation);
            if(callback) callback(translation);
        } else {
            console.log("[ERROR] - translate.translate");
            console.log(err);
        }
    });
};

//detect the sentiment, pass in a text and a callback function
//detectSentiment() will return an object which contains
//a score and a magnitude.
var getSentiment = function(text, callback){
    language.detectSentiment(text, function(err, score, result){
        if (!err) {
            //console.log(result.sentences);
            if(callback) callback(result);
        } else {
            console.log("[ERROR] - language.detectSentiment");
            console.log(err);
        }
    });
};

module.exports.getSentiment = getSentiment;
module.exports.getTranslation = getTranslation;
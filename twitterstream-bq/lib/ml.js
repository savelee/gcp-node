//require the google-cloud npm package
//setup the API keyfile, so your local environment can
//talk to the Google Cloud Platform
const language = require('@google-cloud/language')({
  projectId: process.env.GCLOUD_PROJECT,
  keyFilename: process.env.GCLOUD_KEY_FILE
});

const translate = require('@google-cloud/translate')({
  projectId: process.env.GCLOUD_PROJECT,
  keyFilename: process.env.GCLOUD_KEY_FILE
});

//get language translation, pass in a text, langCode and a callback function
//we get the langCode from the tweet, if it's unknown, we will use
//the translate service to detect the language before translating
//we will save the translation and langcode in BQ too.
var getTranslation = function(text, langCode, callback){
    if(!langCode){
        translate.detect(text, function(err, results) {
            if (!err) {
                translate.translate(text, { 
                    from: results.language, 
                    to: 'en'
                }, function(err, translation, apiResponse) {
                    if (!err) {
                        console.log("!!!!");
                        console.log(apiResponse.data.translations);
                        if(callback) callback(translation, results.language);
                    } else {
                        console.log("[ERROR] - translate.translate");
                        console.log(err);
                    }
                });
            }
        });
    } else if(langCode == "en"){
        if(callback) callback(text, langCode);
    } else {
        translate.translate(text, { 
            from: langCode, 
            to: 'en'
        }, function(err, translation, apiResponse) {
            if (!err) {
                if(callback) callback(translation, langCode);
            } else {
                console.log("[ERROR] - translate.translate");
                console.log(err);
            }
        });
    }

};

var getAnnotation = function(request, callback){
    language.annotateText(request).then(function(responses) {
        var response = responses[0];
        var result = {};
        
        result.documentSentiment = response.documentSentiment;
        
        var organizations = [];
        var persons = [];
        var goods = [];
        var i = 0;

        for(i; i < response.entities.length; i++){
            
            if(response.entities[i].type == "ORGANIZATION") organizations.push(response.entities[i].name);
            if(response.entities[i].type == "PERSON") persons.push(response.entities[i].name);
            if(response.entities[i].type == "CONSUMER_GOOD") goods.push(response.entities[i].name);
        }

        result.organizations = organizations.join(',');
        result.persons = persons.join(',');
        result.goods = goods.join(',');

        callback(result);
    })
    .catch(function(err) {
        console.error(err);
    });
};

module.exports.getAnnotation = getAnnotation;
module.exports.getTranslation = getTranslation;
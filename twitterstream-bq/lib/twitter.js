var express = require('express'),
  router = express.Router(),
  Stream = require('user-stream');

var path = require('path');
var machinelearning = require( path.resolve( __dirname, "ml.js" ) ); //added in a later step
var bigquery = require( path.resolve( __dirname, "bigQuery.js" ) );//added in a later step

//setup the twitter stream API, and provide your consumer and access tokens
const stream = new Stream({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

var search_terms;

var getTwitterAPIParams = function(){
  var params = {};

  //in case you only want to track tweets from a certain language
  //it's set in the .env file
  //for example: TWITTER_SEARCH_LANG=nl
  if(process.env.TWITTER_SEARCH_LANG) {
    params.language = process.env.TWITTER_SEARCH_LANG;
  }

  //these will be search terms to search for, while scraping twitter
  //it's set in the .env file, and needs to be comma seperated
  //for example: TWITTER_SEARCH_TERMS=query1,hashtag1,query2,query3
  if(process.env.TWITTER_SEARCH_TERMS){
    search_terms = process.env.TWITTER_SEARCH_TERMS.toLowerCase().split(',');
    console.log(search_terms);

    //We will only track tweets with the matches as provided
    //by the search_terms array. 
    //You can set  the language of the tweets...
    //https://developer.twitter.com/en/docs/tweets/filter-realtime/guides/basic-stream-parameters
    params.track = search_terms;
  }

  return params;
};

//for totalscores, let's rather work with full numbers
//than floats with lots of decimals. We will also only
//need 2 decimals.
var createNiceNumber = function(num){
  var x = parseInt(num);
  x = (num * 100).toFixed(2);
  return x;
};

//FILTER TWEETS
var getAllMatches = function(text) { 
    var matches = [];

    //We will need to work with Regex, since we don't want to collect spam.
    var regex ='', pRegex='';
    for (term of search_terms) {
      regex += `\\#${term}|\\@${term}|${term}\\s+|\\s+${term}|`
    };

    regex = regex.slice(0,regex.length-1);
    var re = new RegExp(regex);

    search_terms.forEach(function(term) {
        var re = new RegExp(regex);
        var result  = re.exec(text);
        console.log(result);
        if(result) matches.push(result[0]);
    });

    return matches;
};

var getMatches = function(tweettxt){
  var matches = getAllMatches(tweettxt);
  return matches;
};


var openTwitterStream = function(){

  var params = getTwitterAPIParams();

  //this method will open the twitter stream
  stream.stream(params);
  stream.on('data', function(tweet) {

    //Let's not collect return tweets, and tweets need to
    //match our regular expression.
    //if (tweet.text.substring(0,2) != 'RT' 
    //  && re.test(tweet.text)){
    if(tweet.text.substring(0,2) != 'RT'){
        //IIFE? Yeah, we're putting a callback in a callback in callback...
        //..and we need to bind to the original tweet scope.
        machinelearning.getTranslation(tweet.text, tweet.lang, function(translation, lang){
          (function(translation){

            var request = {
              document: {
                content: translation,
                type: 'PLAIN_TEXT',
                language: 'en'
              },
              features: {
                extractEntitySentiment: false,
                extractSyntax: false,
                extractEntities: true,
                extractDocumentSentiment: true
              }
            };

            machinelearning.getAnnotation(request, function(results){
              (function(annotation){

                var mentions = JSON.stringify(tweet.entities.user_mentions);
                var tags = [];
                var i = 0;
                for(i; i<tweet.entities.hashtags.length; i++){
                  tags.push(tweet.entities.hashtags[i].text);
                }


                //let's normalize the data as much on the JS side.
                //get the matches, based on this clean tweet.
                var matches = getMatches(tweet.text);

                //console.log("THE LANGUAGE OF THIS TWEET = " + lang);
                //console.log(tweet.lang);

                var row = {
                  text: tweet.text,
                  translation: translation,
                  lang: lang,
                  created: (parseInt(tweet.timestamp_ms)/1000),
                  from: tweet.user.screen_name,
                  fromId: tweet.user.id + "",
                  coordinates: tweet.coordinates,
                  score: createNiceNumber(annotation.documentSentiment.score),
                  magnitude: createNiceNumber(annotation.documentSentiment.magnitude),
                  organizations: annotation.organizations,
                  persons: annotation.persons,
                  goods: annotation.goods,
                  hashtags: tags.join(',')
                };

                console.log("-----");
                console.log(row);
                console.log("-----");
                
                bigquery.insertInBq(row);

              })(results, tweet);
            });

          })(translation, tweet);
        });

    }
  });
  stream.on('error', function(error) {
    console.error(error);
  });
} ;

openTwitterStream();

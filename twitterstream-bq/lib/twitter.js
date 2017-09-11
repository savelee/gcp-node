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

//these will be search terms to search for, while scraping twitter
//it's set in the .env file, and needs to be comma seperated
//for example: TWITTER_QUERY=query1,hashtag1,query2,query3
const search_terms = process.env.TWITTER_SEARCH_TERMS.split(',');

console.log(search_terms);

//for totalscores, let's rather work with full numbers
//than floats with lots of decimals. We will also only
//need 2 decimals.
var createNiceNumber = function(num){
  var x = parseInt(num);
  x = (num * 100).toFixed(2);
  return x;
}


//extract all political matches from a tweet
var getAllMatches = function(text) { 
    var matches = [];
    search_terms.forEach(function(term) {
        var regex = `(?:${term})`;
        var re = new RegExp(regex);
        var result  = re.exec(text);
        if(result) matches.push(result[0]);
    });

    return matches;
}

var getMatches = function(tweettxt){

  var matches = getAllMatches(tweettxt);
  
  return matches;
}

var openTwitterStream = function(){

  //We will need to work with Regex, since we don't want to collect spam.
  var regex ='', pRegex='';
  for (term of search_terms) {
    regex += `\\#${term}|\\@${term}|${term}\\s+|\\s+${term}|`
  };

  regex = regex.slice(0,regex.length-1);
  var re = new RegExp(regex);

  //We will only track tweets with the matches as provided
  //by the search_terms array. 
  //You can set  the language of the tweets...

  var params = {
    track: search_terms,
    //language: 'nl'
  };

  //this method will open the twitter stream
  stream.stream(params);
  stream.on('data', function(tweet) {

    //Let's not collect return tweets, and tweets need to
    //match our regular expression.
    if (tweet.text.substring(0,2) != 'RT' 
      && re.test(tweet.text)){

        //IIFE? Yeah, we're putting a callback in a callback in callback...
        //..and we need to bind to the original tweet scope.
        machinelearning.getTranslation(tweet.text, function(translation){
          (function(translation){

            machinelearning.getSentiment(translation, function(sentiment){
              (function(sentiment){

                var entities = [];
                var mentions = JSON.stringify(tweet.entities.user_mentions);
                var hashtags = JSON.stringify(tweet.entities.hashtags);
                entities = hashtags.concat(mentions);
        
                //let's normalize the data as much on the JS side.
                //get the matches, based on this clean tweet.
                var matches = getMatches(tweet.text);
                //Tweets might not contain multiple matches.
                //For the scope of this blogpost, we will ignore tweets
                //that talk about multiple matches.
                if(matches.length > 1) return; 
               
                var row = {
                  text: tweet.text,
                  created: (parseInt(tweet.timestamp_ms)/1000),
                  coordinates: tweet.coordinates,
                  score: createNiceNumber(sentiment.documentSentiment.score),
                  magnitude: createNiceNumber(sentiment.documentSentiment.magnitude),
                  hashtags: entities
                };

                console.log("-----");
                console.log(row);
                console.log("-----");
                
                bigquery.insertInBq(row);

              })(sentiment, tweet);
            });

          })(translation, tweet);
        });

    }
  });
  stream.on('error', function(error) {
    console.error(error);
  });
} 

openTwitterStream();

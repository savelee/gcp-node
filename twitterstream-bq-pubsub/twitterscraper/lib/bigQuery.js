//require the google-cloud npm package
//setup the API keyfile, so your local environment can
//talk to the Google Cloud Platform
const bq = require('@google-cloud/bigquery')({
  projectId: process.env.GCLOUD_PROJECT,
  keyFilename: process.env.GCLOUD_KEY_FILE
});

//Make use of a dataset called: mydataset
const dataset = bq.dataset('mydataset');
//Make use of a BigQuery table called: mytable
const table = dataset.table('mytable');

//If the dataset doesn't exist, let's create it.
dataset.exists(function(err, exists) {
  if(!exists){
    dataset.create({
      id: 'mydataset'
    }).then(function(data) {
      console.log("dataset created");

      //If the table doesn't exist, let's create it.
      //Note the schema that we will pass in.
      table.exists(function(err, exists) {
        if(!exists){
          table.create({
            id: 'mytable',
            schema: 'TEXT, TRANSLATION, LANG, CREATED:TIMESTAMP, FROM, FROMID, COORDINATES, SCORE:FLOAT, MAGNITUDE:FLOAT, ORGANIZATIONS, PERSONS, GOODS, HASHTAGS'
          }).then(function(data) {
            console.log("table created");
          });
        }
      });

    });
  }
});

//If the table doesn't exist, let's create it.
//Note the schema that we will pass in.
table.exists(function(err, exists) {
  if(!exists){
    table.create({
      id: 'mytable',
      schema: 'TEXT, TRANSLATION, LANG, CREATED:TIMESTAMP, FROM, FROMID, COORDINATES, SCORE:FLOAT, MAGNITUDE:FLOAT, ORGANIZATIONS, PERSONS, GOODS, HASHTAGS'
    }).then(function(data) {
      console.log("table created");
    });
  }
});

//Insert rows in BigQuery
var insertInBq = function(row){
  table.insert(row, function(err, apiResponse){
    if (!err) {
      console.log("[BIGQUERY] - Saved.");
    }
  });
};

module.exports.insertInBq = insertInBq;
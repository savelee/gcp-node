TwitterStream, Translate, NLP, BigQuery Demo
===============================================================================

To do the social media data scraping, we use the Twitter Streaming API. 
The application code is written in JavaScript for Node.js.

This demo will contain the following technical pieces:

* Machine Learning APIs - To use Natural Language API to understand the context of the data, 
* and since our data is in Dutch (and the Natural Language API doesn’t support the Dutch language yet), we will need the Translate API to translate.
* BigQuery - To collect a lot of data. To analyze this data we use BigQuery and run some queries on it.

I wrote a blog post about this demo here:
- https://www.leeboonstra.com/developer/analyzing-data-with-bigquery-and-machine-learning-apis/

It also includes:

* Compute Engine (1) - To deploy our data scraping script on a VM.
* To visualize our result set, we will make use of Google’s Data Studio (6). We can use some nice charts!


Quick Start
-------------------------------------------------------------------------------

#. You will need to enable the Translate and NLP Apis in the Google Cloud console.

    Go to the cloud console and click on the menu (hamburger) button. 
    Click API Manager > Dashboard and click Enable APIs. 
    Click Natural Language API from the Google Cloud Machine Learning API section. 
    Click Enable. Go back to the previous screen, and select Translation API and hit Enable again.

#. Install all the nodejs packages

    .. code-block:: bash

        npm install


#. Setup the environment keys

    The Twitter Streaming APIs give developers low latency access to Twitter’s global stream of Tweet data. 
    A streaming client that pushes tweets, without any of the overhead associated with polling a REST endpoint.
    We will need to create a Twitter API account. (and if you don’t have Twitter, also a Twitter account).

    https://dev.twitter.com/resources/signup

    With the Twitter API account, you can create an application, and generate the tokens. 
    These tokens, you will need to copy to the *.env* file in the root of your Node project. 
    I've created the **env.txt** file already for you. But you have to rename it to **.env**
    It should have the following contents:

    .. code-block:: bash

        GCLOUD_PROJECT=<my cloud project id>
        GCLOUD_KEY_FILE=</path/to/service_account.json>
        TWITTER_SEARCH_TERMS=<query1,hashtag1,query2,query3>

        CONSUMER_KEY=<my consumer key>
        CONSUMER_SECRET=<my consumer secret>
        ACCESS_TOKEN_KEY=<my access token>
        ACCESS_TOKEN_SECRET=<my access token secret>

        PORT=3000


    Make sure, you also modify the GCLOUD_PROJECT variable, to the name of your Google Cloud project.
    Make sure, you refer to the Google Cloud service account JSON key, in GCLOUD_KEY_FILE, in case you want
    to run this demo on your local machine. In case you deploy it on a VM in GCP, it should work without it.

    The TWITTER_SEARCH_TERMS variable contains the Twitter strings and hashtags you are scraping.
    It needs to be comma seperated, for example: TWITTER_QUERY=query1,hashtag1,query2,query3
    since *lib/twitter.js* reads it like:

    .. code:: javascript
    
        const search_terms = process.env.TWITTER_SEARCH_TERMS.split(',');
    

#. (optional) Modify the Dataset and Table name:

    .. code:: javascript

        //Make use of a dataset called: mydataset
        const dataset = bq.dataset('mydataset');
        //Make use of a BigQuery table called: mytable
        const table = dataset.table('mytable');


#. Run the demo

    .. code-block:: bash
    
        npm start

#. Navigate to BigQuery

    https://bigquery.cloud.google.com

    You can run the example BigQuery queries from the **bq** folder, by copy and pasting it
    into BigQuery. Make sure you modify the name of the dataset and the name of the table, if you have changed it.
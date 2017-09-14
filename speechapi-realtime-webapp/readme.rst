Speech API - realtime from a browser client
===============================================================================

Example on how to use the Speech API realtime with a microphone connected to the browser.

This demo makes use of the NLP API too, it detects the sentiment on realtime.
When the user input is negative, it will mark the screen red.

It makes a recording of the audio too, and writes it down in the root.

On the client, we use the native microphone support
from the browser. This solution works through websockets. Via websockets
we get the data, that will be send to the Speech API via the Node.js client.


Quick Start
-------------------------------------------------------------------------------

#. In the Cloud console enable the Speech API

#. Navigate to the folder

   .. code-block:: bash

        $ cd speechapi-realtime-webapp


#. Setup the environment keys

    There are some settings that needs to be made in the *.env* file in the root of your Node project. 
    I've created the **env.txt** file already for you. But you have to rename it to **.env**
    It should have the following contents:

    .. code-block:: bash

        PORT=9000
        ENV=production
        GCLOUD_PROJECT=<my cloud project id>
        GCLOUD_KEY_FILE=</path/to/service_account.json>

    Make sure, you also modify the GCLOUD_PROJECT variable, to the name of your Google Cloud project. 
    Make sure, you refer to the Google Cloud service account JSON key, in GCLOUD_KEY_FILE, in case you want to run this demo on your local machine. 
    In case you deploy it on a VM in GCP, it should work without it.

#. Install the dependencies needed to run the samples.

    From your terminal, run the following command:

    .. code-block:: bash

        $ npm install

#. Run the example.

    From your terminal, run the following command:

    .. code-block:: bash

        $ npm start

#. (optional) To change clientside code:

    For playing around with the microphone recordings, take a look into
    *public/js/recorder.js*

    WS run on port 9001

#. (optional) To change backend Speech API / NLP API code:

    For playing around with the Speech API and NLP API for Node.js, take a look into
    *app.js*


    There is a piece of code that sets the audio quality and the languageCode in this file:


    .. code:: javascript

        //8kHz = 8000Hertz = phone quality
        //44.1 kHz, 16bit = browser getUserMedia
        const request = {
        config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 41000,
            languageCode: 'en-US'
            //languageCode: 'nl-NL'
        }
        //interimResults: true
        //,single_utterance: true
        };

#. Run the example

    Open your web browser, and navigate to the following URL: http://localhost:9000

    Make sure you have your microphone connected (and that you allow the browser to make use of it). 
    Start the recording. Talk. And stop the recording.
        


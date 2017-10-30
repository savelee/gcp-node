Vision, Storage Demo
===============================================================================

Create a screenshot of a website, by passing in an URL.
Upload this screenshot in a Storage bucket.
Upload an image in a form and upload this is a Storage bucket as well.
Use Machine Learning, Vision API, to detect color schemes and predict
if the image will be visible enough on the website.

Quick Start
-------------------------------------------------------------------------------

TODO

#. (Optional) In case you want to run this script on a VM. 

    You will need to install Node.js on the VM. The VM can be a micro instance. 
    What you also could do, is install a pre-configured Node.js image.
    When you go to the Cloud Launcher, search for Node.js. I picked the Bitnami one.

    You will either need to upload the service account JSON file on the VM. Or stop the VM.
    and edit the scopes for BigQuery. See also: https://cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances#using

    Once done, SSH into it and run a Git Clone on your machine:

    .. code-block:: bash
    
        $ git clone https://github.com/savelee/gcp-node.git
        Cloning into 'gcp-node'...
        remote: Counting objects: 141, done.
        remote: Total 141 (delta 0), reused 0 (delta 0), pack-reused 141
        Receiving objects: 100% (141/141), 846.94 KiB | 0 bytes/s, done.
        Resolving deltas: 100% (50/50), done.
        Checking connectivity... done.
    
    After cloning is done, you can navigate into the folder: **gcp-node**, and continue with the other steps.

#. You will need to enable the Translate and NLP Apis in the Google Cloud console.

    Go to the cloud console and click on the menu (hamburger) button. 
    Click API Manager > Dashboard and click Enable APIs. 
    Click Natural Language API from the Google Cloud Machine Learning API section. 
    Click Enable. Go back to the previous screen, and select Translation API and hit Enable again.

#. Navigate to the folder

   .. code-block:: bash

        $ cd vision-storage


#. Install all the nodejs packages

    .. code-block:: bash

        npm install


#. Setup the environment keys

    The Twitter Streaming APIs give developers low latency access to Twitter’s global stream of Tweet data. 
    A streaming client that pushes tweets, without any of the overhead associated with polling a REST endpoint.
    We will need to create a Twitter API account. (and if you don’t have Twitter, also a Twitter account).

    https://developer.twitter.com/en/docs/accounts-and-users/subscribe-account-activity/guides/getting-started-with-webhooks

    With the Twitter API account, you can create an application, and generate the tokens. 
    These tokens, you will need to copy to the *.env* file in the root of your Node project. 
    I've created the **env.txt** file already for you. But you have to rename it to **.env**
    It should have the following contents:

    Rename the file from the command-line, and edit:

   .. code-block:: bash

        $ mv env.txt .env
        $ nano .env

    File contents:

    .. code-block:: bash

        GCLOUD_PROJECT=<my cloud project id>
        GCLOUD_KEY_FILE=</path/to/service_account.json>
        GCLOUD_STORAGE_BUCKET=<my storage bucket>

        PORT=3000

    Make sure, you also modify the GCLOUD_PROJECT variable, to the name of your Google Cloud project.
    Make sure, you refer to the Google Cloud service account JSON key, in GCLOUD_KEY_FILE, in case you want
    to run this demo on your local machine. In case you deploy it on a VM in GCP, it should work without it.
    In that case, you can nano into the **/lib/bigQuery.js** and **/lib/ml.js** and disable the following lines:

    .. code:: javascript
        
        const vision = require('@google-cloud/vision')({
            projectId: process.env.GCLOUD_PROJECT,
            //keyFilename: process.env.GCLOUD_KEY_FILE
        });

        const storage = require('@google-cloud/storage')({
            projectId: process.env.GCLOUD_PROJECT,
            //keyFilename: process.env.GCLOUD_KEY_FILE
        });

#. Run the demo

    .. code-block:: bash
    
        npm start

    Open http://localhost:3000 in your browser, and submit the form.
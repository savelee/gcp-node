Data Loss Preventation (DLP) - Cloud Function Demo
===============================================================================

Inspect or Redact data, this can be text or images.

Find more info on all data types etc, check these links:
. https://cloud.google.com/dlp/docs/infotypes-categories
. https://cloud.google.com/dlp/docs/likelihood

This demo, demonstrates the DLP API with text strings.
But it's also possible to read text or image files from local filesystems,
Google Cloud Storage or Databases (Datastore & BigQuery). 
Instead of streaming the textual data into the API, you specify location and configuration
information in your API call.

Please see this guide:
. https://cloud.google.com/dlp/docs/inspecting-storage

Quick Start
-------------------------------------------------------------------------------

#. In the Cloud console enable the DLP API:

    https://console.cloud.google.com/flows/enableapi?apiid=dlp.googleapis.com

#. In the Cloud console, navigate to Cloud Functions.

    If it's the first time use, enable the cloud functions API.

#. Choose: `Create Function`

    Specify the following:

        Name: **dlp-inspect** (or **dlp-redact**)
        Region: **us-central1**
        Memory: **256 MB**
        Timeout: **60 sec**
        Trigger: **HTTP**

#. In the inline editor copy the contents of **inspect.js** or **redact.js** in the `index.js` tab.

    This is the JavaScript / Node.js code, which will run an HTTP Express function.

#. In the inline editor copy the contents of **package.json** in the `package.json` tab.

    This is the npm package.json file. Which loads the DLP Google Cloud package.

#. Set the Stage bucket

    In case you don't have a Google Cloud Storage bucket yet, create a new bucket called:
    *yourname-examples-cloudfunctions*.

    This bucket will be used to upload this version of your function.

#. Enter the function to execute.

    This will be `inspect` in case you choose the contents from `inspect.js` or `redact` in case you choose the contents of `redact.js`.

#. Click create.

    It will return you an url, similar to: https://us-central1-[yourname]-examples.cloudfunctions.net/dlp-inspect
    or https://us-central1-[yourname]-examples.cloudfunctions.net/dlp-redact.

    Visit the page in the browser, to inspect or redact your data.



## Google Cloud Node.js Samples by Lee Boonstra

This directory contains samples for Google Cloud API. 


### Setup

#### Setup Google Cloud

1.  Download and install the [Google Cloud
    SDK](https://cloud.google.com/sdk/docs/), which includes the
    [gcloud](https://cloud.google.com/sdk/gcloud/) command-line tool.

1. Open the Google Cloud Console: http://console.cloud.google.com

1. Make sure a Billing Account is setup & linked. (Select Billing in Main Menu)

1.  Create a [new Google Cloud Platform project from the Cloud
    Console](https://console.cloud.google.com/project) or use an existing one.

    Click the + icon in the top bar.
    Enter an unique project name. For example: *yourname-examples*.
    It will take a few minutes till everything is ready.

1. Initialize the Cloud SDK.:
    

        $ gcloud init
        2 (Create a new configuration)
        yourname-examples
        (login)
        list
        #number-of-choice
        y

#### Authentication

Authentication is typically done through `Application Default Credentials`,
which means you do not have to change the code to authenticate as long as
your environment has credentials. You have a few options for setting up
authentication:

1. When running locally, use the `Google Cloud SDK`

        gcloud auth application-default login


    Note that this command generates credentials for client libraries. To authenticate the CLI itself, use:
    
        gcloud auth login

1. When running on App Engine or Compute Engine, credentials are already
   set-up. However, you may need to configure your Compute Engine instance
   with `additional scopes`_.

1. You can create a `Service Account key file`_. This file can be used to
   authenticate to Google Cloud Platform services from any environment. To use
   the file, set the ``GOOGLE_APPLICATION_CREDENTIALS`` environment variable to
   the path to the key file, for example:

        export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service_account.json

[Application Default Credentials]( https://cloud.google.com/docs/authentication#getting_credentials_for_server-centric_flow)
[Additional scopes] (https://cloud.google.com/compute/docs/authentication#using)
[Service Account key file]( https://developers.google.com/identity/protocols/OAuth2ServiceAccount#creatinganaccount)


### Install Dependencies

1. Install `node` and `npm` if you do not already have them.

1. See the `readme.txt` file for descriptions on how to run each example.


## Contributing changes

* See [CONTRIBUTING.md](CONTRIBUTING.md)

## Licensing

* See [LICENSE](LICENSE)

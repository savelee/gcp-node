Google Cloud Node.js Samples by Lee Boonstra
===============================================================================

This directory contains samples for Google Cloud API. 


Setup
-------------------------------------------------------------------------------

Setup Google Cloud
++++++++++++++++++++

#. Install Google Cloud SDK. See the install steps here: https://cloud.google.com/sdk/downloads

#. Open the Google Cloud Console: http://console.cloud.google.com

#. Make sure a Billing Account is setup & linked. (Select Billing in Main Menu)

#. Create a new GCP project. 

    Click the + icon in the top bar.
    Enter an unique project name. For example: *yourname-examples*.
    It will take a few minutes till everything is ready.

#. Activate the Project with the gcloud command-line tools:
    
    .. code-block:: bash
    
        $ gcloud init
        2 (Create a new configuration)
        yourname-examples
        (login)
        list
        #number-of-choice
        y

Authentication
++++++++++++++

Authentication is typically done through `Application Default Credentials`,
which means you do not have to change the code to authenticate as long as
your environment has credentials. You have a few options for setting up
authentication:

#. When running locally, use the `Google Cloud SDK`

    .. code-block:: bash

        gcloud auth application-default login


    Note that this command generates credentials for client libraries. To authenticate the CLI itself, use:

    .. code-block:: bash
    
        gcloud auth login

#. When running on App Engine or Compute Engine, credentials are already
   set-up. However, you may need to configure your Compute Engine instance
   with `additional scopes`_.

#. You can create a `Service Account key file`_. This file can be used to
   authenticate to Google Cloud Platform services from any environment. To use
   the file, set the ``GOOGLE_APPLICATION_CREDENTIALS`` environment variable to
   the path to the key file, for example:

    .. code-block:: bash

        export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service_account.json

.. _Application Default Credentials: https://cloud.google.com/docs/authentication#getting_credentials_for_server-centric_flow
.. _additional scopes: https://cloud.google.com/compute/docs/authentication#using
.. _Service Account key file: https://developers.google.com/identity/protocols/OAuth2ServiceAccount#creatinganaccount


Install Dependencies
++++++++++++++++++++

#. Install `node` and `npm` if you do not already have them.

#. See the `readme.txt` file for descriptions on how to run each example.
const Vision = require('@google-cloud/vision').v1p2beta1;
const Storage = require('@google-cloud/storage');

const bucketName = process.env.GCLOUD_STORAGE_BUCKET;

const vision = new Vision.ImageAnnotatorClient();

const storage = Storage({
    projectId: process.env.GCLOUD_PROJECT
});

function Controller() {}

Controller.prototype.uploadToBucket = function(assets, cb){
    var i = 0;
    var counter = 0;
    var objs = [];

    for(i; i<assets.length; i++){
        var filename = assets[i].path;

        storage.bucket(bucketName).upload(filename)
            .then((data) => {
                console.log(`${data[0].name} uploaded to ${bucketName}.`);
                counter++;
                var newName = data[0].name;
                objs.push(newName);

                if(counter == assets.length){
                    cb(objs);
                }
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
    }
}

Controller.prototype.detectVision = function(files, res){
    console.log(files);
    var me = this;
    var requests = [];
    for(var i = 0; i<files.length; i++){
        console.log(files[i]);
        const fileName = files[i];
        console.log(fileName);
        const gcsSourceUri = `gs://${bucketName}/${fileName}`;
        const gcsDestinationUri = `gs://${bucketName}/${fileName}.json`;
        
        var inputConfig = {
            // Supported mime_types are: 'application/pdf' and 'image/tiff'
            mimeType: 'application/pdf',
            gcsSource: {
                uri: gcsSourceUri,
            },
        };
        var outputConfig = {
            gcsDestination: {
                uri: gcsDestinationUri,
            },
        };

        var requestsElement = {
            inputConfig: inputConfig,
            outputConfig: outputConfig,
            features : [
            {
                type: 'DOCUMENT_TEXT_DETECTION'
            }
            //{
            //    type: 'IMAGE_PROPERTIES'
            //}, 
            //{
            //    type: 'LOGO_DETECTION'
            //} 
            //{
            //    type: 'WEB_DETECTION'
            //}
            //,{    
            //    type: 'LABEL_DETECTION'
            //}, 
            //{    
            //    type: 'TEXT_DETECTION'
            //},
            ]
        };
        requests.push(requestsElement);
    }

    vision.asyncBatchAnnotateFiles({requests: requests}).then(function(result) {       
        console.log(result);

        var response = { 
            title: "The PDF will be processed."
        };

        res.render('result', response);
    })
    .catch(function(err) {
        console.error(err);
        res.render('index', { title: "Oops something went wrong." });
    });
};

Controller.prototype.submitHandler = function(req, res){
    var me = this,
    pdfs = req.files;

    var mlCb = function(pdfs){
        me.detectVision(pdfs, res);
    };

     me.uploadToBucket(pdfs, mlCb);
};

module.exports = Controller;
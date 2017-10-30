const Pageres = require('pageres');
const Vision = require('@google-cloud/vision');
const Storage = require('@google-cloud/storage');
const ColorDiff = require('color-difference');
const rgbHex = require('rgb-hex');
const arraySort = require('array-sort');

const bucketName = process.env.GCLOUD_STORAGE_BUCKET;

const vision = Vision({
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename: process.env.GCLOUD_KEY_FILE 
});

const storage = Storage({
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename: process.env.GCLOUD_KEY_FILE 
});

const MAX_COLORS = process.env.SETTINGS_MAX_COLORS;
const EXTRA_WEIGHT = process.env.SETTINGS_EXTRA_WEIGHT_MOST_DOMINANT_COL;
const RESOLUTION = process.env.SETTINGS_SCREENSHOT_RESOLUTION;

function Controller() {}

Controller.prototype.getScreenshots =  function(urls, cb) {
    const tempFolder = './_temp';
    var images = [];
 
    var pageres = new Pageres({delay: 1, timeout: 120});
    for(var i=0; i<=urls.length; i++){
        pageres.src(urls[i], [RESOLUTION]);
    }
    pageres.dest(tempFolder).run().then(function(res){
        for(var i=1; i<=res.length; i++){
            images.push(tempFolder+"/"+res[i-1].filename); //TODO DO I NEED _TEMP?
            if(res.length == i) cb(images);
        }
    });    
};

Controller.prototype.uploadToBucket = function(paths, cb){
    var i = 0;
    var counter = 0;
    var gcPaths = [];

    for(i; i<paths.length; i++){
        var filename = paths[i];

        storage.bucket(bucketName).upload(filename)
            .then((data) => {
                console.log(`${data[0].name} uploaded to ${bucketName}.`);
                counter++;
                var newName = data[0].name;
                gcPaths.push('gs://' + bucketName + '/' + newName);

                if(counter == paths.length){
                    cb(gcPaths);
                }
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
    }
}

Controller.prototype.detectVision = function(paths, res){
    var me = this;
    var requests = [];
    for(var i = 0; i<paths.length; i++){
        console.log(paths[i]);
        var requestsElement = {
            image : {
                source: {
                    gcsImageUri : paths[i]
                }
            },
            features : [{
                type: Vision.v1.types.Feature.Type.IMAGE_PROPERTIES
            }, 
            {
                type: Vision.v1.types.Feature.Type.LOGO_DETECTION
            } 
            //{
            //    type: Vision.v1.types.Feature.Type.WEB_DETECTION
            //}
            //,{    
            //    type: Vision.v1.types.Feature.Type.LABEL_DETECTION
            //}, 
            //{    
            //    type: Vision.v1.types.Feature.Type.TEXT_DETECTION
            //},
            ]
        };
        requests.push(requestsElement);
    }

    vision.batchAnnotateImages({requests: requests}).then(function(result) {       
        var screenshots = [];
        var x = 0;
        var banners = [];
        
        for(x; x<result[0].responses.length; x++){
            
            //process the first image.            
            var w = 0, rgbs = [], tags = [];
            var imageOutput = result[0].responses[x];
            
            //var labels = imageOutput.webDetection.webEntities;
            //var labels = imageOutput.labelAnnotations;
            var labels = imageOutput.logoAnnotations;
            for(w; w<labels.length; w++){
                if(labels[w]) tags.push(labels[w].description);
            }

            var colors = imageOutput.imagePropertiesAnnotation.dominantColors.colors;
            arraySort(colors, 'pixelFraction');
            colors.reverse();
            

            for(var z = 0; z<colors.length; z++){
                var rgb = "rgb("+colors[z].color.red+", "+colors[z].color.green+", "+colors[z].color.blue+ ")";
                //give the most dominant color some extra weight
                if(EXTRA_WEIGHT && z == 0) {
                    for(var o=0; o<EXTRA_WEIGHT; o++){
                        console.log("extra weight");
                        rgbs.push(rgb);
                    }
                }
                
                rgbs.push(rgb);
            }
            //for(var z = 0; z<colors.length; z++){
            //    console.log(colors[z].score);
            //}
            if(MAX_COLORS) rgbs = rgbs.slice(0,MAX_COLORS);

            var imageUri = requests[x].image.source.gcsImageUri;

            //is this a screenshot or a banner?
            if(imageUri.indexOf('-' + RESOLUTION + '.png') == -1){
                var banner = {
                    colors: rgbs,
                    score: 0,
                    image: imageUri.replace("gs://", "https://storage.cloud.google.com/"),
                    name: imageUri.split("gs://"+bucketName+"/")[1]
                };

                banners.push(banner);
            } else {
                var screenshot = {
                    colors: rgbs,
                    image: imageUri.replace("gs://", "https://storage.cloud.google.com/"),
                    tags: tags
                };

                imageUri = imageUri.split('-' + RESOLUTION + '.png')[0];
                screenshot.name = imageUri.split("gs://"+bucketName+"/")[1];

                screenshots.push(screenshot);
            }
        }

        //loop through every screenshot
        for(var i=0; i<screenshots.length; i++){
            console.log(screenshots[i].name);
            //merge banners with each screenshot in screenshots
            screenshots[i].banners = [];

            //loop through every banner
            for(var z=0; z<banners.length; z++){
                var totalscore = 0;
                var b = {
                    name: banners[z].name,
                    image: banners[z].image,
                    colors: banners[z].colors
                };
            
                console.log("  " + b.name);

                //for every banner, loop through all the colors
                for(var y=0; y<banners[z].colors.length; y++){
                    var col = rgbHex(banners[z].colors[y]);
                    var screenCol = rgbHex(screenshots[i].colors[y]);
                    totalscore = totalscore + ColorDiff.compare(col, screenCol);
                    
                    //console.log("      " + ColorDiff.compare(col, screenCol));
                }

                console.log("[totalscore] " + Math.round(totalscore/banners[z].colors.length));     
                b.score = Math.round(totalscore/banners[z].colors.length);
                screenshots[i].banners.push(b);
                arraySort(screenshots[i].banners, 'score');
                screenshots[i].banners.reverse();
            }
        } 

        result = { 
            title: "The results have been calculated. This overview will show you which banner stands out the most." ,
            screenshots: screenshots
        };

        //console.log(result);
        res.render('result', result);
    })
    .catch(function(err) {
        console.error(err);
        res.render('index', { title: "Oops something went wrong." });
    });
};

Controller.prototype.makePredictions = function(req, res){
    var me = this,
    i = 0,
    urls = req.body.url.split(';'),
    banners = req.files;
    bannerPaths = [];

    for(i; i<banners.length; i++){
        bannerPaths.push(banners[i].path);
    }

    var mlCb = function(paths){
        me.detectVision(paths, res);
    };

    var cb = function(photos){
        photos = photos.concat(bannerPaths);
  
        me.uploadToBucket(photos, mlCb);
    };

    me.getScreenshots(urls, cb);
};

module.exports = Controller;
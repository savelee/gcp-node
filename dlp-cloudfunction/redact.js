// Imports the Google Cloud Data Loss Prevention library
const DLP = require('@google-cloud/dlp');

// Instantiates a client
const dlp = DLP();

// The string to inspect
const string = 'My name is Lee and my email is leeboonstra@gmail.com. This is my ip: 46.139.108.120';
// The path to a local file to inspect. Can be a text, JPG, or PNG file.
//const fileName = 'path/to/image.png';
// The string to replace sensitive data with
const replaceString = 'REDACTED';

// The minimum likelihood required before returning a match
const minLikelihood = 'LIKELIHOOD_UNSPECIFIED';
// The maximum number of findings to report (0 = server maximum)
const maxFindings = 0;
// The infoTypes of information to match
const infoTypes = [{ name: 'EMAIL_ADDRESS' }, { name: 'IP_ADDRESS'}];
// Whether to include the matching string
const includeQuote = true;

/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.redact = function main(req, res) {
    const items = [
        { type: 'text/plain', value: string }
    ];
    //const fileItems = [{
    //    type: mime.lookup(fileName) || 'application/octet-stream',
    //    data: Buffer.from(fs.readFileSync(filepath)).toString('base64')
    //}];

    const replaceConfigs = infoTypes.map((infoType) => {
        return {
            infoType: infoType,
            replaceWith: replaceString
        };
    });

    const request = {
        inspectConfig: {
            infoTypes: infoTypes,
            minLikelihood: minLikelihood
        },
        items: items,
        replaceConfigs: replaceConfigs
    };


    dlp.redactContent(request).then(function(responses) {
        //var response = responses[0];
        res.status(200).send(responses[0].items[0].value);
    }).catch(function(err) {
       res.status(200).send(`Error in inspectFile: ' + ${err.message || err}`);
    });

};
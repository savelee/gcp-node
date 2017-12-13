require('dotenv').config();

// Imports the Google Cloud Data Loss Prevention library
const DLP = require('@google-cloud/dlp');

// Instantiates a client
const dlp = DLP({
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename: process.env.GCLOUD_KEY_FILE 
});

// The string to inspect
const string = 'My name is Lee and my email is leeboonstra@gmail.com. This is my ip: 46.139.108.120. I am from GERMANY Deutschland and here is my reisepasse C234FGHJK2';
// The path to a local file to inspect. Can be a text, JPG, or PNG file.
//const fileName = 'path/to/image.png';

// The minimum likelihood required before returning a match
const minLikelihood = 'LIKELIHOOD_UNSPECIFIED';
// The maximum number of findings to report (0 = server maximum)
const maxFindings = 0;
// The infoTypes of information to match
const infoTypes = [
    { name: 'EMAIL_ADDRESS' }, 
    { name: 'IP_ADDRESS'},
    { name: 'GERMANY_PASSPORT'}

];
// Whether to include the matching string
const includeQuote = true;

/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.inspect = function main(req, res) {

    // Construct file data to inspect
    const fileItems = [
        { type: 'text/plain', value: string }
    ];
    //const fileItems = [{
    //    type: mime.lookup(fileName) || 'application/octet-stream',
    //    data: Buffer.from(fs.readFileSync(filepath)).toString('base64')
    //}];

    // Construct request
    const request = {
        inspectConfig: {
            infoTypes: infoTypes,
            minLikelihood: minLikelihood,
            maxFindings: maxFindings,
            includeQuote: includeQuote
        },
        items: fileItems
    };

    // Run request
    dlp.inspectContent(request)
    .then((response) => {
        const findings = response[0].results[0].findings;
        if (findings.length > 0) {
            console.log(`Findings:`);
            var results = "";
            findings.forEach((finding) => {
                if (includeQuote) {
                    console.log(`\tQuote: ${finding.quote}`);
                    results = results + `\tQuote: ${finding.quote}`;
                }
                console.log(`\tInfo type: ${finding.infoType.name}`);
                results = results + `\tInfo type: ${finding.infoType.name}`;
                console.log(`\tLikelihood: ${finding.likelihood}`);
                results = results + `\tLikelihood: ${finding.likelihood}`;
            });
            res.status(200).send(results);
        } else {
            console.log(`No findings.`);
            res.status(200).send(`No findings.`);
        }
    })
    .catch((err) => {
        console.log(`Error in inspectFile: ${err.message || err}`);
        res.status(200).send(`Error in inspectFile: ' + ${err.message || err}`);
    });

};
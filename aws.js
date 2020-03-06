const AWS = require('aws-sdk')
const bucket = 'st-big1' 

const config = new AWS.Config({
    region: 'eu-west-1'
})

const client = new AWS.Rekognition({
    region: 'eu-west-1'
});

var s3params = {
    Bucket: "st-big1",
};

var females = 0;
var males = 0;

var s3 = new AWS.S3(config);

s3.listObjectsV2(s3params, function (err, data) {
    console.log("Number of files: " + data.Contents.length);
    data.Contents.forEach(data => {
        console.log(data.Key);
        detectFaces(data.Key);
    });


});

function detectFaces(filename) {
    const params = {
        Image: {
            S3Object: {
                Bucket: bucket,
                Name: filename
            },
        },
        Attributes: ['ALL']
    }
    client.detectFaces(params, function (err, response) {
        if (err) {
            console.log(err, err.stack); // an error occurred
        } else {
            console.log(`Detected faces for: ${filename}`)
            console.log('Number of faces is ' + response.FaceDetails.length)
            if (response.FaceDetails.length > 1) {
                response.FaceDetails.forEach(data => {
                    let low = data.AgeRange.Low
                    let high = data.AgeRange.High
                    /*console.log(data);
                    console.log(`The detected face is between: ${low} and ${high} years old`)
                    console.log(`  Gender.Value:           ${data.Gender.Value}`)
                    console.log(`  Gender.Confidence:      ${data.Gender.Confidence}`)

                     */
                    if (data.Gender.Value == 'Male') {
                        males++;
                    } else if (data.Gender.Value == 'Female') {
                        females++;
                    }
                    console.log("Females: " + females);
                    console.log("Males: " + males);

                   //console.log("------------")
                    //console.log("")
                })
            } else {
                console.log("More than one face")
            }

        } // if
    });
}

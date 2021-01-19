// var AWS = require('aws-sdk');
// var uuid = require('node-uuid');

require('dotenv').config()

// const config = new AWS.Config({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION
// })

const identifyPerson = (AWS, key) => {
  
const BUCKET = process.env.S3_BUCKET 
const PHOTO = key
// const PHOTO  = 'demo/wp2732752-suits-wallpapers.jpg' // the name of file

  const client = new AWS.Rekognition();
  const params = {
    Image: {
      S3Object: {
        Bucket: BUCKET,
        Name: PHOTO
      },
    },
    MaxLabels: 5,
    MinConfidence: 70
  }
  return client.detectLabels(params, function (err, response) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      console.log(`Detected labels for: ${PHOTO}`)
      response.Labels.forEach(label => {
        console.log(`Label:      ${label.Name}`)
        console.log(`Confidence: ${label.Confidence}`)
        console.log("Instances:")
        label.Instances.forEach(instance => {
          let box = instance.BoundingBox
          console.log("  Bounding box:")
          console.log(`    Top:        ${box.Top}`)
          console.log(`    Left:       ${box.Left}`)
          console.log(`    Width:      ${box.Width}`)
          console.log(`    Height:     ${box.Height}`)
          console.log(`  Confidence: ${instance.Confidence}`)
        })
        console.log("Parents:")
        label.Parents.forEach(parent => {
          console.log(`  ${parent.Name}`)
        })
        console.log("------------")
        console.log("")
      }) // for response.labels
    } // if
  }).promise();
}

module.exports = identifyPerson
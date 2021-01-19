require('dotenv').config()

const identifyPerson = (AWS, photo) => {
  
const BUCKET = process.env.S3_BUCKET 
const PHOTO = photo
// const PHOTO  = 'demo/wp2732752-suits-wallpapers.jpg' // the name of file

  const client = new AWS.Rekognition();
  const params = {
    Image: {
      S3Object: {
        Bucket: BUCKET,
        Name: `${process.env.INITIAL_FOLDER}/${PHOTO}`
      },
    },
    MaxLabels: 10,
    MinConfidence: 70
  }
  return client.detectLabels(params).promise();
}

module.exports = identifyPerson
const path = require('path');
const fs = require('fs');
const AWS = require("aws-sdk")
const identifyPerson = require("./rekognition");
const copyAndDelete = require('./s3copyObject');
const colors = require('colors');
require('dotenv').config()

const directoryPath = path.join(__dirname, '../../whatsapp');
//passsing directoryPath and callback function

const config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})
const s3 = new AWS.S3();

const uploadFile = (fileName) => {
    const fileContent = fs.readFileSync('../../whatsapp/'+fileName);
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key:  `${process.env.INITIAL_FOLDER}/${fileName}`, // File name you want to save as in S3
        Body: fileContent,
        ACL: 'public-read',
    };

    return s3.upload(params).promise();
};

fs.readdir(directoryPath, async function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    // console.log(files[i])
    let humanPhotos = 0;
    for(let i = 5900; i > 5500; i--){
        // if(i<1500){
            console.log(colors.green("******** Processing Photo ", files[i], i, " ********"))
            const fileName = files[i]
            try {
                let uploadRes = await uploadFile(fileName)
                console.log(colors.cyan("File successfully uploaded! ", uploadRes.Location))
                let rekognitionRes = await identifyPerson(AWS, fileName)
                console.log(colors.brightWhite("Recognized successfully"))
                let allLables = []
                rekognitionRes.Labels.forEach(label => {
                    allLables.push(label.Name)
                })
                if((allLables.includes("Person") || allLables.includes("Human") || allLables.includes("Face")) && !allLables.includes("Poster") && !allLables.includes("Advertisement") && !allLables.includes("Text")){
                    let copyAndDeleteRes = await copyAndDelete(AWS, fileName)
                    humanPhotos++;
                    console.log(colors.magenta(copyAndDeleteRes, "copied and deleted with labels", allLables))
                } else console.log(colors.red("not copied", allLables))
            } catch(err) {
                console.log(`Error at index ${i} & image name ${files[i]}`, err)
            }
            console.log('\n\n')
        // }
    }

    console.log(colors.bgBlue('\n\n Total photos of humans: ', humanPhotos))
});

//0 - 1500
//7471 - 6000
//6000 - 5500

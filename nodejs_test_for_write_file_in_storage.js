const { Storage } = require('@google-cloud/storage');

async function uploadFile(bucketName, filename, contents) {
    const storage = new Storage({
        apiEndpoint: 'http://localhost:4443',
    });

    const bucket = storage.bucket(bucketName);
    await bucket.file(filename).save(contents);
    console.log(`File ${filename} caricato in ${bucketName}.`);
}
async function createBucket(bucketName) {
    const storage = new Storage({
        apiEndpoint: 'http://localhost:4443',
    });

    await storage.createBucket(bucketName);
    console.log(`Bucket ${bucketName} creato.`);
}

const bucketName = 'my-bucket';
const filename = 'my-file.txt';
const contents = 'Questo è il contenuto del mio file.';


createBucket('my-bucket').catch(console.error);
uploadFile(bucketName, filename, contents)
    .catch(console.error);
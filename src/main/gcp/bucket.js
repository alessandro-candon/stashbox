import {Storage} from "@google-cloud/storage";
import {ipcMain} from "electron";
import {store} from "../local/store";


const getBucketName = (serviceAccount) => {
    const parsedServiceAccount = JSON.parse(serviceAccount);
    return parsedServiceAccount.project_id || 'my-fake-project' + '-bucket-1';
}
const FILES_INFO_NAME = 'files-info.sb';
const serviceAccount = store.get('SERVICE_ACCOUNT');
const parsedServiceAccount = JSON.parse(serviceAccount);
const storage = new Storage({
    credentials: parsedServiceAccount,
    projectId: parsedServiceAccount.project_id,
    apiEndpoint: process.env.FAKE_GCP_SERVER_ENDPOINT || undefined
});

async function bucketCreate(data) {
    const {locationType, location, classType} = data;
    await storage.createBucket(getBucketName(serviceAccount), {
        location: location,
        [classType]: true,
    });
}

async function bucketExists() {
    const [buckets] = await storage.getBuckets();
    const bucketSearched = buckets.find(bucket => bucket.name === getBucketName(serviceAccount));
    return !!bucketSearched;
}

async function bucketListFiles(path) {
    const bucketName = getBucketName(serviceAccount);
    const [files] = await storage.bucket(bucketName).getFiles({
        prefix: path
    });
    return files.map(file => ({
        name: file.name,
        size: file.metadata.size,
        contentType: file.metadata.contentType,
        updated: file.metadata.updated,
    })).filter(file => !file.name.endsWith('.sb'));
}

async function createFolder(path) {
    // download the file FILES_INFO_NAME, if not exists create it empty
    // add the new folder to the file with this informations {name: path, type: 'folder', size: 0, contentType: 'folder', updated: new Date()}
    // upload the file FILES_INFO_NAME in the root of the storage
    const bucketName = getBucketName(serviceAccount);
}

export function GcpBucket() {
    ipcMain.handle('bucket-create', async (event, data) => {
        await bucketCreate(data);
    })
    ipcMain.handle('bucket-exists', async (event, data) => {
        return await bucketExists(data);
    });

    ipcMain.handle('bucket-list-files', async (event, path) => {
        return await bucketListFiles(path);
    });

    // ipcMain.handle('bucket-get-folder-content', async (event, path) => {
    //     const storage = new Storage({
    //         credentials: parsedServiceAccount
    //     });
    //     const bucketName = getBucketName(serviceAccount);
    //     const filePath = '.file-content.sb';
    //     const file = storage.bucket(bucketName).file(filePath);
    //     const contents = (await file.download()).toString('utf-8');
    //     console.log(contents)
    //     if (!contents && contents.length === 0) {
    //         return [];
    //     }
    //     return contents.split('\n').filter(line => line.trim() !== '').map(line => JSON.parse(line));
    // });

    ipcMain.handle('bucket-create-folder', async (event, path) => {
    });
}

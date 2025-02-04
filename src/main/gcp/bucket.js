import {Storage} from "@google-cloud/storage";
import {store} from "../local/store";

const getBucketName = (serviceAccount) => {
    const parsedServiceAccount = JSON.parse(serviceAccount);
    return (parsedServiceAccount.project_id || 'my-fake-project') + '-storage-1';
}
let serviceAccount = store.get('SERVICE_ACCOUNT');

const setupStorage = (serviceAccount) => {
    if (serviceAccount !== undefined) {
        return new Storage({
            credentials: JSON.parse(serviceAccount),
            projectId: JSON.parse(serviceAccount).project_id,
            apiEndpoint: process.env.FAKE_GCP_SERVER_ENDPOINT || undefined
        });
    }
}
let storage = setupStorage(serviceAccount);

export const gcpBucket =  {
    bucket_store_setup: async function (event) {
        serviceAccount = store.get('SERVICE_ACCOUNT');
        storage = setupStorage(serviceAccount);
    },
    bucket_exists: async function () {
        const [buckets] = await storage.getBuckets();
        const bucketSearched = buckets.find(bucket => bucket.name === getBucketName(serviceAccount));
        return !!bucketSearched;
    },
    bucket_list_files: async function (event, path) {
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
    },
    bucket_create_folder: async function createFolder(path) {
        const bucketName = getBucketName(serviceAccount);
        // todo : is not implemented
        console.error('Not implemented yet');
        return bucketName;
    },
    bucket_create: async function bucketCreate(event, data) {
        console.log('>>>>', data);
        const { location, classType} = data;
        await storage.createBucket(getBucketName(serviceAccount), {
            location: location.toUpperCase(),
            [classType.toUpperCase()]: true,
        });
    }
}

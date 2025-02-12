import {Storage} from "@google-cloud/storage";
import {StorageControlClient} from "@google-cloud/storage-control";
import {store} from "../local/store";

const GCP_STORAGE_BUCKET_SUFFIX = '-storage-1';
let serviceAccount = store.get('SERVICE_ACCOUNT');
let parsedServiceAccount = serviceAccount ? JSON.parse(serviceAccount) : undefined;
let bucketName = (parsedServiceAccount.project_id || 'my-fake-project') + GCP_STORAGE_BUCKET_SUFFIX;

const setupStorage = () => {
    if (serviceAccount && parsedServiceAccount) {
        return new Storage({
            credentials: parsedServiceAccount,
            projectId: parsedServiceAccount.project_id,
            apiEndpoint: process.env.FAKE_GCP_SERVER_ENDPOINT || undefined
        });
    }
}

const setupStorageControlClient = () => {
    if (serviceAccount && parsedServiceAccount) {
        return new StorageControlClient({
            credentials: parsedServiceAccount,
            projectId: parsedServiceAccount.project_id,
        });
    }
}

let storage = setupStorage();
let storageControlClient = setupStorageControlClient();

export const gcpBucket =  {
    bucket_store_setup: async function (event) {
        serviceAccount = store.get('SERVICE_ACCOUNT');
        parsedServiceAccount = serviceAccount ? JSON.parse(serviceAccount) : undefined;
        bucketName = (parsedServiceAccount.project_id || 'my-fake-project') + GCP_STORAGE_BUCKET_SUFFIX;
        storage = setupStorage(serviceAccount);
        storageControlClient = setupStorageControlClient();
    },
    bucket_exists: async function () {
        const [buckets] = await storage.getBuckets();
        const bucketSearched = buckets.find(bucket => bucket.name === bucketName);
        return !!bucketSearched;
    },
    bucket_list_files: async function (event, parentPath, queryForNextPageRequest = {}) {
        let request = queryForNextPageRequest?.pageToken ? queryForNextPageRequest : {
            prefix: parentPath,
            autoPaginate: false
        };
        const [files, queryForNextPage] = await storage.bucket(bucketName).getFiles(request);
        const filesNormalized =  files.map(file => ({
            name: file.name,
            isDirectory: false,
            path: file.name,
            size: file.metadata.size,
            extension: file.name.split('.').pop(),
            isHighlighted: false,
            isSelected: false
        }));
        return [filesNormalized, queryForNextPage];
    },
    bucket_list_folders: async function (event, parentPath, queryForNextPageRequest = {}) {
        let request = queryForNextPageRequest?.pageToken ? queryForNextPageRequest : {
            parent: storageControlClient.bucketPath('_', bucketName),
            prefix: parentPath,
            autoPaginate: false,
        };
        const [folders, queryForNextPage] = await storageControlClient.listManagedFolders(request);
        const foldersNormalized =  folders.map((folder) => {
            return {
                name: folder.name.split('/').filter(Boolean).pop(),
                isDirectory: true,
                path: folder.name.replace(`projects/_/buckets/${bucketName}/managedFolders/`, ''),
                size: 0,
                extension: '',
                isHighlighted: false,
                isSelected: false
            }
        }).filter(folder => folder.path.replace(parentPath, '')
                .split('/').filter(Boolean).length === 1);
        return [foldersNormalized, queryForNextPage];
    },
    bucket_upload_local_folder: async function uploadFolder(event, localPath, files) {
    },
    bucket_upload_local_file: async function uploadFile(event, localPath, localFileName, remotePath) {

    },
    bucket_create_folder: async function createFolder(event, parentPath, folderName) {
        const bucketPath = storageControlClient.bucketPath('_', bucketName);
        const managedFolderId = `${parentPath}/${folderName}`;
        console.log('managedFolderId : ', managedFolderId)
        const [response] = await storageControlClient.createManagedFolder({
            parent: bucketPath,
            managedFolderId,
        });
    },
    bucket_create: async function bucketCreate(event, data) {
        const { location, classType} = data;
        const [bucket] = await storage.createBucket(bucketName, {
            location: location.toUpperCase(),
            [classType.toUpperCase()]: true,
        });
        await storage.bucket(bucket.name).setMetadata({
            iamConfiguration: {
                uniformBucketLevelAccess: {
                    enabled: true,
                },
            },
        });
    },
    bucket_delete: async function bucketDelete(event) {
        await storage.bucket(bucketName).delete();
    },
}

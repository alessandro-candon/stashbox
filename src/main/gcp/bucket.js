import {Storage} from "@google-cloud/storage";
import {StorageControlClient} from "@google-cloud/storage-control";
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

const setupStorageControlClient = (serviceAccount) => {
    if (serviceAccount !== undefined) {
        return new StorageControlClient({
            credentials: JSON.parse(serviceAccount),
            projectId: JSON.parse(serviceAccount).project_id,
        });
    }
}

let storage = setupStorage(serviceAccount);

let storageControlClient = setupStorageControlClient(serviceAccount);

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
        return  files.map(file => ({
            name: file.name,
            size: file.metadata.size,
            contentType: file.metadata.contentType,
            updated: file.metadata.updated,
        }));
    },
    bucket_list_folders: async function (event, parentPath) {
        let bucketPath = storageControlClient.bucketPath('_', getBucketName(serviceAccount));
        const request = {
            parent: bucketPath,
            prefix: parentPath
        };
        const [folders] = await storageControlClient.listManagedFolders(request);
        const foldersNormalized =  folders.map((folder) => {
            return {
                name: folder.name.split('/').filter(Boolean).pop(),
                isDirectory: true,
                path: folder.name.replace("projects/_/buckets/stashbox-447213-storage-1/managedFolders/", ''),
                size: 0,
                extension: '',
                isHighlighted: false,
                isSelected: false
            }
        });
        return foldersNormalized.filter((folder) => {
            const relativePath = folder.path.replace(parentPath, '');
            return relativePath.split('/').filter(Boolean).length === 1;
        })
    },
    bucket_upload_local_folder: async function uploadFolder(event, localPath, files) {
    },
    bucket_create_folder: async function createFolder(event, parentPath, folderName) {
        const bucketPath = storageControlClient.bucketPath('_', getBucketName(serviceAccount));
        const managedFolderId = `${parentPath}/${folderName}`;
        console.log('managedFolderId : ', managedFolderId)
        const [response] = await storageControlClient.createManagedFolder({
            parent: bucketPath,
            managedFolderId,
        });
    },
    bucket_create: async function bucketCreate(event, data) {
        const { location, classType} = data;
        const [bucket] = await storage.createBucket(getBucketName(serviceAccount), {
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
        const bucketName = getBucketName(serviceAccount);
        await storage.bucket(bucketName).delete();
    },
}

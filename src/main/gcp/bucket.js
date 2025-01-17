const { Storage } = require('@google-cloud/storage');
const { ipcMain } = require('electron');

// Dynamically import electron-store
let Store;
async function initializeStore() {
  if (!Store) {
    Store = (await import('electron-store')).default;
  }
  return new Store();
}

const getBucketName = (serviceAccount) => {
  const parsedServiceAccount = JSON.parse(serviceAccount);
  return parsedServiceAccount.project_id || 'my-fake-project' + '-bucket-1';
};

const FILES_INFO_NAME = 'files-info.sb';

// Initialize Storage asynchronously
async function initializeStorage() {
  const store = await initializeStore();
  const serviceAccount = store.get('SERVICE_ACCOUNT');
  const parsedServiceAccount = JSON.parse(serviceAccount);

  return new Storage({
    credentials: parsedServiceAccount,
    projectId: parsedServiceAccount.project_id,
    apiEndpoint: process.env.FAKE_GCP_SERVER_ENDPOINT || undefined,
  });
}

// Define IPC Handlers
function GcpBucket() {
  ipcMain.handle('bucket-create', async (event, data) => {
    try {
      const storage = await initializeStorage();
      const { locationType, location, classType } = data;
      const serviceAccount = (await initializeStore()).get('SERVICE_ACCOUNT'); // Only initialize once
      await storage.createBucket(getBucketName(serviceAccount), {
        location: location,
        [classType]: true,
      });
    } catch (err) {
      console.error('Error creating bucket:', err);
      throw new Error('Failed to create bucket.');
    }
  });

  ipcMain.handle('bucket-exists', async (event, data) => {
    try {
      const storage = await initializeStorage();
      const [buckets] = await storage.getBuckets();
      const serviceAccount = (await initializeStore()).get('SERVICE_ACCOUNT'); // Only initialize once
      const bucketSearched = buckets.find((bucket) => bucket.name === getBucketName(serviceAccount));
      return !!bucketSearched;
    } catch (err) {
      console.error('Error checking if bucket exists:', err);
      throw new Error('Failed to check bucket existence.');
    }
  });

  ipcMain.handle('bucket-list-files', async (event, path) => {
    try {
      const storage = await initializeStorage();
      const serviceAccount = (await initializeStore()).get('SERVICE_ACCOUNT'); // Only initialize once
      const bucketName = getBucketName(serviceAccount);
      const [files] = await storage.bucket(bucketName).getFiles({
        prefix: path,
      });
      return files
        .map((file) => ({
          name: file.name,
          size: file.metadata.size,
          contentType: file.metadata.contentType,
          updated: file.metadata.updated,
        }))
        .filter((file) => !file.name.endsWith('.sb'));
    } catch (err) {
      console.error('Error listing files:', err);
      throw new Error('Failed to list files.');
    }
  });

  ipcMain.handle('bucket-create-folder', async (event, path) => {
    try {
      const storage = await initializeStorage();
      const serviceAccount = (await initializeStore()).get('SERVICE_ACCOUNT'); // Only initialize once
      const bucketName = getBucketName(serviceAccount);

      // Create a "folder" by adding an empty file
      const folderFile = storage.bucket(bucketName).file(`${path}/`);
      await folderFile.save(''); // Save an empty file to simulate a folder.

      // Now, update the metadata (or download) if you need to manage a file with folder info.
      const fileInfoFile = storage.bucket(bucketName).file(FILES_INFO_NAME);

      try {
        // Try to download the file
        const contents = (await fileInfoFile.download()).toString('utf-8');
        let fileInfo = contents ? JSON.parse(contents) : [];

        // Add the new folder info
        fileInfo.push({
          name: path,
          type: 'folder',
          size: 0,
          contentType: 'folder',
          updated: new Date(),
        });

        // Upload the updated file
        await fileInfoFile.save(JSON.stringify(fileInfo, null, 2));
      } catch (err) {
        // If the file doesn't exist, create it
        const fileInfo = [
          { name: path, type: 'folder', size: 0, contentType: 'folder', updated: new Date() },
        ];
        await fileInfoFile.save(JSON.stringify(fileInfo, null, 2));
      }
    } catch (err) {
      console.error('Error creating folder:', err);
      throw new Error('Failed to create folder.');
    }
  });
}

// Export the GcpBucket function
module.exports = { GcpBucket };

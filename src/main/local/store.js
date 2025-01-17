const { ipcMain } = require('electron');

// Use dynamic import to load electron-store as an ES module
let Store;
(async () => {
    Store = (await import('electron-store')).default;  // Dynamically import the Store class
})();

ipcMain.handle('store-delete[SERVICE_ACCOUNT]', async (event) => {
    const store = new Store();
    store.delete('SERVICE_ACCOUNT');
});

ipcMain.handle('store-save[SERVICE_ACCOUNT]', async (event, value) => {
    const store = new Store();
    store.set('SERVICE_ACCOUNT', value);
});

ipcMain.handle('store-delete[GCP_ACCOUNT_CONFIGURATION]', async (event) => {
    const store = new Store();
    store.delete('SERVICE_ACCOUNT');
});

ipcMain.handle('store-save[GCP_ACCOUNT_CONFIGURATION]', async (event, value) => {
    const store = new Store();
    console.log('store-save', 'GCP_ACCOUNT_CONFIGURATION', value);
    store.set('GCP_ACCOUNT_CONFIGURATION', value);
});

ipcMain.handle('store-get[GCP_ACCOUNT_CONFIGURATION]', async (event, key) => {
    const store = new Store();
    return store.get('GCP_ACCOUNT_CONFIGURATION');
});

ipcMain.handle('store-delete-all', async (event, key) => {
    const store = new Store();
    return store.clear();
});

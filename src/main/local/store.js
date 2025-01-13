import Store from 'electron-store';
import {ipcMain} from "electron";

export const store = new Store();
export function LocalStore() {

    ipcMain.handle(`store-delete[SERVICE_ACCOUNT]`, async (event) => {
        store.delete('SERVICE_ACCOUNT');
    });

    ipcMain.handle(`store-save[SERVICE_ACCOUNT]`, async (event, value) => {
        store.set('SERVICE_ACCOUNT', value);
    });

    ipcMain.handle(`store-delete[SERVICE_ACCOUNT]`, async (event, value) => {
        store.delete('SERVICE_ACCOUNT');
    });

    ipcMain.handle(`store-delete[GCP_ACCOUNT_CONFIGURATION]`, async (event) => {
        store.delete('SERVICE_ACCOUNT');
    });

    ipcMain.handle(`store-save[GCP_ACCOUNT_CONFIGURATION]`, async (event, value) => {
        console.log('store-save', 'GCP_ACCOUNT_CONFIGURATION', value);
        store.set('GCP_ACCOUNT_CONFIGURATION', value);
    });

    ipcMain.handle(`store-get[GCP_ACCOUNT_CONFIGURATION]`, async (event, key) => {
        return store.get('GCP_ACCOUNT_CONFIGURATION');
    });

    ipcMain.handle(`store-delete-all`, async (event, key) => {
        return store.clear();
    });
}
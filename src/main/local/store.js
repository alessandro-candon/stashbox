import Store from 'electron-store';

export const store = new Store();
export const localStore = {
    'store-delete[SERVICE_ACCOUNT]': async (event) => {
        store.delete('SERVICE_ACCOUNT');
    },
    'store-save[SERVICE_ACCOUNT]': async (event, value) => {
        store.set('SERVICE_ACCOUNT', value);
    },
    'store-delete[GCP_ACCOUNT_CONFIGURATION]': async (event) => {
        store.delete('SERVICE_ACCOUNT');
    },
    'store-save[GCP_ACCOUNT_CONFIGURATION]': async (event, value) => {
        store.set('GCP_ACCOUNT_CONFIGURATION', value);
    },
    'store-get[GCP_ACCOUNT_CONFIGURATION]': async (event, key) => {
        return store.get('GCP_ACCOUNT_CONFIGURATION');
    },
    'store-delete-all': async (event, key) => {
        return store.clear();
    }
};
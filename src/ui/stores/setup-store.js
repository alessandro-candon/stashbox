import {defineStore} from "pinia";
import {ref} from "vue";

export const useSetupStore = defineStore('setup', () => {
    const clientId = ref(null);
    const clientEmail = ref(null);

    function setBucketConfig(data) {
        if (!data.clientId || !data.clientEmail) {
            console.error('Invalid data for configuration of bucket', data);
        }
        clientId.value = data.clientId;
        clientEmail.value = data.clientEmail
    }
    function setBucketConfigWithServiceAccount(serviceAccount) {
        const decodedServiceAccount = JSON.parse(serviceAccount);
        clientId.value = decodedServiceAccount.client_id;
        clientEmail.value = decodedServiceAccount.client_email;
    }
    function getBucketConfig() {
        return {
            clientId: clientId.value,
            clientEmail: clientEmail.value
        }
    }
    function isSetupDone() {
        return clientId.value && clientEmail.value;
    }
    function resetAll() {
        clientId.value = null;
        clientEmail.value = null;
    }
    return {
        resetAll,
        getBucketConfig,
        setBucketConfigWithServiceAccount,
        setBucketConfig,
        isSetupDone
    }
})
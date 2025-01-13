import {defineStore} from "pinia";
import {ref} from "vue";

export const useSetupStore = defineStore('setup', () => {
    const clientId = ref(null);
    const clientEmail = ref(null);

    function setBucketConfig(data) {
        clientId.value = data.clientId;
        clientEmail.value = data.clientEmail
    }
    function setBucketConfigWithServiceAccount(serviceAccount) {
        const decodedServiceAccount = JSON.parse(serviceAccount);
        clientId.value = decodedServiceAccount.client_id;
        clientEmail.value = decodedServiceAccount.client_email;
    }
    function getBucketConfig() {
        console.log('clientId', clientId.value);
        console.log('clientEmail', clientEmail.value);
        return {
            clientId: clientId.value,
            clientEmail: clientEmail.value
        }
    }
    function isSetupDone() {
        return clientId.value && clientEmail.value;
    }
    return {
        getBucketConfig,
        setBucketConfigWithServiceAccount,
        setBucketConfig,
        isSetupDone
    }
})
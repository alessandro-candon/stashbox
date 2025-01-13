<template>
  <FullScreenLayout v-if="!setupStore.isSetupDone()">
    <SetupView></SetupView>
  </FullScreenLayout>
  <AppLayout v-if="setupStore.isSetupDone()"></AppLayout>
</template>

<script setup>
import FullScreenLayout from "./ui/layouts/FullScreenLayout.vue";
import SetupView from "./ui/views/SetupView.vue";
import AppLayout from "./ui/layouts/AppLayout.vue";
import {useSetupStore} from "./ui/stores/setup-store";
import {useRouter} from "vue-router";
const router = useRouter()


const setupStore = useSetupStore();

const setupEnv = async () => {
  const data = await window.api.invoke('store-get[GCP_ACCOUNT_CONFIGURATION]');
  setupStore.setBucketConfig(data)
  if (setupStore.isSetupDone()) {
    await router.push({
      name: 'local-files',
      force: true,
      replace: true,
    })
  }
}
setupEnv();
</script>
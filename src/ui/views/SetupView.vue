<script setup>
import {
  QPage,
  QCard,
  QCardSection,
  QForm,
  QInput,
  QCardActions,
  QBtn,
  useQuasar,
  QSelect,
  QRadio,
  QSeparator,
  QItemLabel
} from 'quasar'
import {ref} from "vue";
import {useSetupStore} from "../stores/setup-store";
import {locationOptionsType} from "../assets/setup_storage_location_options";
import {storageClassOptions} from "../assets/setup_storage_class_options";
import {useRouter} from "vue-router";

const $q = useQuasar();
const router = useRouter();
const setupStore = useSetupStore();

const serviceAccount = ref('')
const locationTypeRef = ref('MULTI_REGION');
const locationRef = ref('');
const classRef = ref('');

const onSubmit = async () => {
  $q.loading.show()
  try {
    const data = {
      locationType: locationTypeRef.value,
      location: locationRef.value.value,
      classType: classRef.value.value
    };
    await window.api.invoke('store-save[SERVICE_ACCOUNT]', serviceAccount.value);
    const isStorageExists = await window.api.invoke('bucket-exists', data)
    if (isStorageExists) {
      $q.notify({
        message: 'Storage already exists',
        color: 'warning',
        position: 'top'
      })
    } else {
      await window.api.invoke('bucket-create', data)
      $q.notify({
        message: 'Storage created successfully',
        color: 'positive',
        position: 'top'
      })
    }
    setupStore.setBucketConfigWithServiceAccount(serviceAccount.value)
    await router.push({
      name: 'local-files',
      force: true,
      replace: true,
    })
  }catch (e){
    await window.api.invoke('store-delete-all');
    $q.notify({
      message: 'Something went wrong',
      color: 'negative',
      position: 'top'
    })
  } finally {
    $q.loading.hide();
  }
}

</script>

<template>
  <div id="q-app">
    <q-page class="window-height window-width row justify-center items-center">
      <div class="column row justify-center items-center">
        <div class="row">
          <q-card square class="shadow-24" style="min-width: 800px; min-height: 540px">
            <q-card-section class="bg-primary">
              <h4 class="text-h5 text-white q-my-md">Setup your StashBox</h4>
            </q-card-section>
            <q-card-section>
              <q-form class="q-px-sm q-pt-xl" @submit="onSubmit">
                <q-input
                    square
                    clearable
                    v-model="serviceAccount"
                    type="textarea"
                    lazy-rules
                    label="GCP Service Account"
                    :autofocus="false"
                    :rules="[(val) => (val && val.length > 0) || 'Please type something']"
                >
                </q-input>
                <q-separator></q-separator>
                <q-item-label>Location</q-item-label>
                <div v-for="option in locationOptionsType" :key="option.value">
                  <q-radio
                      v-model="locationTypeRef"
                      :val="option.value"
                      :label="option.label"
                      @input="onSubmit"
                  />
                  <span style="display: block; margin-top: -10px"
                        class="q-ml-xl q-pa-none text-caption">{{ option.description }}</span>
                </div>
                <q-select
                    v-if="locationTypeRef"
                    v-model="locationRef"
                    :options="locationOptionsType.find(option => option.value === locationTypeRef).options"
                    option-label="label"
                    option-value="value"
                    option-description="description"
                    label="Select Location Type"
                    filled
                    clearable
                    @input="onSubmit"
                    autocomplete
                />
                <q-separator></q-separator>
                <q-item-label>Class</q-item-label>
                <q-select
                    v-model="classRef"
                    :options="storageClassOptions"
                    option-label="label"
                    option-value="value"
                    label="Select Class"
                    filled
                    clearable
                    @input="onSubmit"
                    autocomplete
                ></q-select>

                <input
                    type="submit"
                    style="position: absolute; left: -9999px; width: 1px; height: 1px"
                    tabindex="-1"
                />
              </q-form>
            </q-card-section>
            <q-card-actions>
              <q-btn
                  unelevated
                  size="lg"
                  color="secondary"
                  class="full-width text-white"
                  label="Start"
                  @click="onSubmit"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </q-page>
  </div>
</template>

<style scoped>

</style>
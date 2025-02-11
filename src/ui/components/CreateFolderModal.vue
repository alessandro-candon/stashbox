<template>
  <q-dialog v-model="promptRef" persistent>
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="q-pa-md">
          <div class="row">
            <div class="col-11">
              <span>New folder</span>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input
              v-model="folderNameRef"
              label="Name"
              outlined
              clearable
              lazy-rules
              :rules="[(val) => !!val || 'Required']"
              autofocus
          ></q-input>
          <q-card-actions align="right" class="text-primary">
            <q-btn type="reset" flat label="Cancel" v-close-popup />
            <q-btn type="submit" flat label="Save" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { QDialog, QCard, QBtn, QCardSection, QInput, QCardActions, QForm } from 'quasar'
import {ref} from "vue";

const props = defineProps({
  prompt: Boolean,
})
const promptRef = ref(props.prompt)
const folderNameRef = ref('')

const emit = defineEmits(['save-success'])

const onSubmit = async () => {
  emit('save-success', folderNameRef.value)
}

const onReset = () => {
  promptRef.value = false
  folderNameRef.value = ''
}
</script>

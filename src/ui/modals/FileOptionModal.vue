<script setup>
import {useQuasar, QDialog, QCard, QCardSection} from "quasar";
import {ref} from "vue";

const $q = useQuasar()

const props = defineProps({
  prompt: Boolean,
  file: { type: Object, required: true },
})

const promptRef = ref(props.prompt)

</script>

<template>
  <q-dialog v-model="promptRef">
    <q-card style="width: 500px; max-width: 80vw">
      <q-card-section>
        <div class="q-pa-md">
          <div class="row">
            <div class="col-11">
              <span>{{file.name}}</span>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
<script setup>
import {QPageSticky, QFab, QFabAction} from "quasar";
import {onMounted, onUnmounted, ref} from "vue";
import FileComponent from "../components/FileComponent.vue";
import {useQuasar} from "quasar";

const $q = useQuasar();

const files = ref([]);
const commandPressedRef = ref(false);
const currentRoute = ref('/')
const rightClickedFileRef = ref()
const loadFiles = () => {
  window.api.invoke('bucket-list-files', '').then((data) => {
    console.log(data);
  });

  // window.api.invoke('bucket-get-folder-content', '').then((data) => {
  //   console.log(data);
  // });
}

const onCreateFolder = () => {
  window.api.invoke('bucket-create-folder', '/').then((data) => {

  });
}

const onFileDoubleClick = (file) => {
  if (file.isDirectory) {
    console.log('open folder of cloud')
  } else {
    $q.notify({
      message: 'File clicked: ' + file.name,
      color: 'primary',
      position: 'top'
    });
  }
}

const onFileClick = (file) => {
  if (commandPressedRef.value) {
    file.isHighlighted = !file.isHighlighted;
  } else {
    const fileOldValue = file.isHighlighted;
    files.value.map((f) => f.isHighlighted = false);
    file.isHighlighted = !fileOldValue;
  }
}

const onRightClick = (file) => {
  console.log('right click',file)
  rightClickedFileRef.value = file;
}

const handleKeyDown = (event) => {
  if (event.key === 'Meta') {
    commandPressedRef.value = true;
  }

};
const handleKeyUp = (event) => {
  if (event.key === 'Meta') {
    commandPressedRef.value = false;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
});

loadFiles()
</script>

<template>

  <div class="q-pa-md">
    <div class="q-gutter-x-md row">
      <div v-for="(file,index) in files" :key="index">
        <FileComponent
            :file="file"
            @double-click="onFileDoubleClick"
            @click="onFileClick"
            @right-click="onRightClick"
        ></FileComponent>
      </div>
    </div>
  </div>

  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-fab icon="expand_less" direction="up" color="accent">
      <q-fab-action @click="onCreateFolder" color="positive" icon="settings_applications" />
    </q-fab>
  </q-page-sticky>
</template>

<style scoped>

</style>
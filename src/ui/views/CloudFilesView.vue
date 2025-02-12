<script setup>
import {QPageSticky, QFab, QFabAction, QBreadcrumbs, QBreadcrumbsEl} from "quasar";
import {onMounted, onUnmounted, ref, watch} from "vue";
import FileComponent from "../components/FileComponent.vue";
import {useQuasar} from "quasar";
import CreateFolderModal from "../components/CreateFolderModal.vue";

const $q = useQuasar();

const filesRef = ref([]);
const commandPressedRef = ref(false);
const currentRoute = ref('')
const rightClickedFileRef = ref()
const onCreateFolderModalRef = ref(false)
let cloudFolderNextPage = {};
let cloudFilesNextPage = {};

const loadFiles = async () => {
  if (cloudFilesNextPage !== null) {
    const [cloudFiles, cloudFilesNextPageRequest] = await window.api.invoke(
        'bucket_list_files',
        currentRoute.value,
        cloudFilesNextPage
    );
    console.log('cloudFiles',cloudFiles)
    cloudFilesNextPage = cloudFilesNextPageRequest;
    filesRef.value = filesRef.value.concat(cloudFiles).sort((a, b) => a.name.localeCompare(b.name));
  }
}

const loadFolders = async () => {
  if (cloudFolderNextPage !== null) {
    const [cloudFolders, cloudFolderNextPageRequest] = await window.api.invoke(
        'bucket_list_folders',
        currentRoute.value,
        cloudFolderNextPage
    );
    console.log('cloudFolders',cloudFolders)
    cloudFolderNextPage = cloudFolderNextPageRequest;
    filesRef.value = filesRef.value.concat(cloudFolders).sort((a, b) => a.name.localeCompare(b.name));
  }
}

const loadContent = async () => {
  await loadFolders();
  await loadFiles();
}

const resetContent = () => {
  cloudFolderNextPage = {};
  cloudFilesNextPage = {};
  filesRef.value = [];
}

const getBreadcrumbs = () => {
  const parts = currentRoute.value.split('/').filter(Boolean);
  return parts.map((part, index) => {
    return {
      name: part,
      path: parts.slice(0, index + 1).join('/')
    };
  });
}
const onCreateFolder = () => {
  onCreateFolderModalRef.value = true;
}

const onSaveFolder = (folderName) => {
  console.log('folderName', folderName)
  onCreateFolderModalRef.value = false;
  window.api.invoke('bucket_create_folder',currentRoute.value,folderName).then(() => {
    resetContent();
    loadContent();
  });
}

const onFileDoubleClick = (file) => {
  if (file.isDirectory) {
    currentRoute.value = currentRoute.value === '' ? file.name : currentRoute.value + '/' + file.name;
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
    filesRef.value.map((f) => f.isHighlighted = false);
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

watch(currentRoute, () => {
  resetContent();
  loadContent();
});


loadContent();

</script>

<template>
  <div class="q-pl-md q-pt-lg">
    <q-breadcrumbs>
      <q-breadcrumbs-el icon="home" @click="currentRoute = ''"/>
      <q-breadcrumbs-el
          v-for="(breadcrumb, index) in getBreadcrumbs()"
          :key="index"
          :label="breadcrumb.name"
          @click="currentRoute = breadcrumb.path"
      />
    </q-breadcrumbs>
  </div>
  <div class="q-pa-md">
    <div class="q-gutter-x-md row">
      <div v-for="(file,index) in filesRef" :key="index">
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
      <q-fab-action @click="onCreateFolder" color="positive" icon="add" />
    </q-fab>
  </q-page-sticky>

  <CreateFolderModal v-model="onCreateFolderModalRef" @save-success="onSaveFolder"></CreateFolderModal>
</template>

<style scoped>

</style>
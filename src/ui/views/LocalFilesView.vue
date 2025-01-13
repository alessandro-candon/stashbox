<script setup>
import {QBreadcrumbs, QBreadcrumbsEl, useQuasar} from 'quasar'
import {onMounted, onUnmounted, ref, watch} from "vue";
import FileComponent from "../components/FileComponent.vue";
import FileOptionModal from "../modals/FileOptionModal.vue";

const $q = useQuasar();

const files = ref([]);
const commandPressedRef = ref(false);
const currentRoute = ref('/')
const openFileOptionModalRef = ref(false)
const rightClickedFileRef = ref()

const loadFiles = () => {
  window.api.invoke('read-dir', currentRoute.value).then((data) => {
    files.value = data;
  });
}
const getBreadcrumbs = () => {
  const parts = currentRoute.value.split('/').filter(Boolean);
  return parts.map((part, index) => {
    return {
      name: part,
      path: '/' + parts.slice(0, index + 1).join('/')
    };
  });
}

const onFileDoubleClick = (file) => {
  if (file.isDirectory) {
    currentRoute.value = file.path;
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
  console.log(file)
  rightClickedFileRef.value = file;
  openFileOptionModalRef.value = true;
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
  loadFiles();
});

loadFiles();
</script>

<template>
  <div class="q-pl-md q-pt-lg">
    <q-breadcrumbs>
      <q-breadcrumbs-el icon="home" @click="currentRoute = '/'"/>
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

  <FileOptionModal :file="rightClickedFileRef" v-model="openFileOptionModalRef"></FileOptionModal>
</template>

<style scoped>

</style>
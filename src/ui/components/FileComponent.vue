<script setup>
import {QIcon} from 'quasar';

const props = defineProps({
  file: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['click', 'doubleClick', 'rightClick']);

let clickTimeout = null;

function truncateName(name) {
  return name.length > 14 ? name.slice(0, 11) + '...' : name;
}

const handleClick = () => {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
    clickTimeout = null;
    emit('doubleClick', props.file);
  } else {
    clickTimeout = setTimeout(() => {
      emit('click', props.file);
      clickTimeout = null;
    }, 300);
  }
};

const handleRightClick = (event) => {
  event.preventDefault();
  emit('rightClick', props.file);
};
</script>

<template>
  <div :class="['file-element']" @click="handleClick" @contextmenu="handleRightClick">
    <q-icon
        :class="['file-icon',{ 'file-icon-highlighted': file.isHighlighted }]"
        :name="file.isDirectory ? 'folder': 'insert_drive_file'"
        size="64px" :color="file.isDirectory ? 'blue': 'grey'"
    />
    <div :class="['file-name', { 'file-name-highlighted': file.isHighlighted }]">{{ truncateName(file.name) }}</div>
  </div>
</template>

<style scoped>
.file-element {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 130px;
}
.file-icon {
  margin: 0;
}

.file-icon-highlighted {
  background-color: rgba(211, 211, 211, 0.5); /* lightgray with 50% opacity */
}

.file-name {
  padding: 1px 20px;
  margin-top: 2px;
  font-size: 16px;
  color: black;
  border-radius: 8px;
  width: 120px;
  text-align: center;
}
.file-name-highlighted {
  color: white;
  background-color: cornflowerblue;
  font-size: 16px;
}
</style>
<template>
  <h1>{{ msg }}</h1>

  <van-button type="primary" @click="open">主要按钮</van-button>
  <van-button type="success">成功按钮</van-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showDialog } from 'vant';

defineProps<{ msg: string }>()

const count = ref(0)

const open = () => {
  showDialog({
    message: '生命远不止连轴转和忙到极限，人类的体验远比这辽阔、丰富得多。',
    theme: 'round-button',
  }).then(() => {
    // on close
  })
}
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>

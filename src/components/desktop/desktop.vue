<template>
  <div class="workspace" ref="workspace">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
// import { useDesktopStore } from "./desktopStore";

// const desktopInfo = useDesktopStore();

const workspace = ref<HTMLElement | null>(null)

onMounted(() => {
  // const desktopStyle = getComputedStyle(workspace.value as HTMLElement, null);
  // const { width, height } = desktopStyle;
  // desktopInfo.setDesktopInfo({ width: parseInt(width), height: parseInt(height)});
})
</script>

<style lang="scss" scoped>
.workspace {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>

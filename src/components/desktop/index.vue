<script lang="ts" setup>
import StatusBar from '../statusbar/statusbar.vue'
import Dock from '../dock/dock.vue'
import DesktopVue from './desktop.vue'
import BgImage from '@/assets/background/light.jpg'
import Launchpad from '../launchpad/launchpad.vue'
import { activeApp, initDesktop } from '@/hook/useRunApp'
import { runningQueue } from '@/hook/useRunApp'

const bgImage = ref(`url(${BgImage})`)

const desktop = ref<InstanceType<typeof DesktopVue> | null>()

const runningApps = computed(() => {
  let queue = runningQueue.values()
  return Array.from(queue)
})

document.addEventListener("contextmenu", (e) => {
  e.preventDefault()
})

onMounted(() => {
  initDesktop(desktop.value!)
})

</script>

<template>
  <div id="desktop">
    <StatusBar></StatusBar>
    <DesktopVue ref="desktop">
      <Launchpad :bg="bgImage"></Launchpad>
      <component v-for="app in runningApps" :key="app.runningId" :active="app.runningId === activeApp" :is="app.vnode">
      </component>
    </DesktopVue>
    <Dock></Dock>
  </div>
</template>

<style lang="scss" scoped>
#desktop {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  background-image: v-bind(bgImage);
  background-position: center;
}
</style>

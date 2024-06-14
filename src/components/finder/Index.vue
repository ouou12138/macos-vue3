<script lang="ts" setup>
import StatusBar from '../statusbar/StatusBar.vue'
import Dock from '../dock/Dock.vue'
import AppContainerVue from '../app-container/AppContainer.vue'
import DesktopVue from './Desktop.vue'
import BgImage from '@/assets/background/light.jpg'
import Launchpad from '../launchpad/launchpad.vue'

const bgImage = ref(`url(${BgImage})`)
</script>

<template>
  <div id="desktop">
    <StatusBar></StatusBar>
    <DesktopVue>
      <AppContainerVue appName="哔哩哔哩">
        <iframe width="100%" height="100%" src="https://www.bilibili.com/" frameborder="0"></iframe>
      </AppContainerVue>

      <Launchpad :bg="bgImage"></Launchpad>
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

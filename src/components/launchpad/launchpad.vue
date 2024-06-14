<template>
  <div class="launchpad" v-show="show">
    <div class="animate-container w-full h-full">
      <swiper
        class="w-full h-full"
        :slides-per-view="1"
        :modules="[Pagination]"
        :pagination="{ clickable: true, bulletActiveClass: 'bullet-active' }"
        style="--swiper-pagination-bottom: 100px; --swiper-pagination-bullet-inactive-opacity: 0.8"
      >
        <swiper-slide v-for="(list, index) in appsList" :key="index">
          <div class="w-full h-full flex items-center justify-center">
            <div class="app-copntianer">
              <div class="app-item flex-shrink-0" v-for="app in list" :key="app.appId">
                <img class="w-full object-cover" :src="app.icon" alt="" />
                <div class="text-white text-3">{{ app.name }}</div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import apps from '@/data/apps'
import { useRunningApp } from '@/hook/useRunningApp'
import { useDesktopStore } from '../finder/desktopStore'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'animate.css'
import { nanoid } from 'nanoid'

const APP_KEY = 'launchpad'

const appInfo = apps.find((app) => app.key === APP_KEY)
if (!appInfo) throw new Error('app not found')

const props = defineProps<{
  bg: string
}>()
const { bg: bgImage } = toRefs(props)
const { desktopInfo } = storeToRefs(useDesktopStore())
const show = ref(false)
const newApps: typeof apps = []
newApps.push(...apps, ...apps, ...apps, ...apps)

const appsList = clipAppsPages(newApps)

// const appWidth = computed(() => {
//   return Number(((desktopInfo.value.width * 0.7) / 7).toFixed(0))
// })
// const dockHeight = ref(desktopInfo.value.dockHeight)

function clipAppsPages(aList: typeof apps) {
  const res: (typeof apps)[] = []
  let step = 35
  let page = Math.ceil(aList.length / step)

  while (page > 0) {
    res.unshift(aList.slice(35 * (page - 1), step * page))
    page--
  }
  return res
}
function switchLaunchpad() {
  show.value = show.value ? false : true
}

defineExpose({
  switchLaunchpad
})

const runningId = nanoid()

const instance = getCurrentInstance()

useRunningApp(runningId, instance)
appInfo.runningId = runningId
</script>

<style lang="scss" scoped>
.launchpad {
  position: absolute;
  z-index: 1999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: v-bind(bgImage);
  background-repeat: no-repeat;
  background-position: center;
  overflow: hidden;
  display: flex;
  align-items: center;
  &::after {
    content: '';
    display: block;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color: black, $alpha: 0.5);
  }
}
.app-copntianer {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, 1fr);
  width: 80%;
  height: 70%;
  margin: 0 auto;
  text-align: center;
  .app-item {
    width: 100%;
    max-width: 128px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
.animate-container {
  transform: scale(1.5);
  opacity: 0;
  animation: FadeZoomIn 200ms;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in;
}
@keyframes FadeZoomIn {
  0% {
    transform: scale(1.1);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

<style>
.bullet-active {
  background-color: white;
}
.launchpad .swiper-pagination-horizontal {
  width: fit-content;
  left: 50%;
  transform: translateX(-50%);
}
</style>

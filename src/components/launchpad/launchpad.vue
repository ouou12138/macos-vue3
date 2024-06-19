<template>
  <div class="launchpad" v-show="show" :class="animateName" @click="switchLaunchpad">
    <div class="animate-container w-full h-full" :class="animateName">
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
              <div
                class="app-item flex-shrink-0"
                v-for="app in list"
                :key="app.appId"
                @click="runApp(app)"
              >
                <div class="logo">
                  <img class="w-full object-cover" :src="app.icon" alt="" />
                </div>
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
import apps, { type AppInfo } from '@/data/apps'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import { runApp as useRunApp } from '@/hook/useRunApp'
import 'swiper/css'
import 'swiper/css/pagination'

const props = defineProps<{
  bg: string
}>()
const { bg: bgImage } = toRefs(props)
const show = ref(false)
const newApps: typeof apps = []
newApps.push(...apps, ...apps, ...apps, ...apps)

const appsList = clipAppsPages(newApps)

const animateName = ref('fadeIn')

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
async function switchLaunchpad() {
  show.value = !show.value
    ? (() => {
        animateName.value = 'fadeIn'
        return true
      })()
    : await (() => {
        return new Promise((resolve) => {
          animateName.value = 'fadeOut'
          setTimeout(() => resolve(false), 200)
        })
      })()
}
function runApp(app: AppInfo) {
  // if (!app.runningId) throw new Error('app not running')
  // const instance = useRunningApp(app.runningId)
  // console.log(instance, 'instance')
  // instance.exposed.switchLaunchpad()
  if (app.render) {
    app.render()
    return
  }
  useRunApp(app.key)
}

window.switchLaunchpad = switchLaunchpad

defineExpose({
  switchLaunchpad
})
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
  &.fadeIn {
    animation: fadeIn 200ms;
    animation-fill-mode: forwards;
  }
  &.fadeOut {
    animation: fadeOut 200ms;
    animation-fill-mode: forwards;
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
    position: relative;
    .logo {
      display: block;
      position: relative;
      width: 100%;
    }
    &:active {
      .logo::after {
        content: '';
        display: block;
        position: absolute;
        top: 9%;
        left: 9%;
        right: 9%;
        bottom: 11%;
        background-color: rgba($color: black, $alpha: 0.5);
        border-radius: 20%;
      }
    }
  }
}
.animate-container {
  transform: scale(1.5);
  opacity: 0;
  animation-timing-function: ease-in;
}
.animate-container.fadeOut {
  animation: FadeZoomOut 200ms;
  animation-fill-mode: forwards;
}
.animate-container.fadeIn {
  animation: FadeZoomIn 200ms;
  animation-fill-mode: forwards;
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
@keyframes FadeZoomOut {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.1);
    opacity: 0;
  }
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
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

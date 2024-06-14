<template>
  <div class="status-bar">
    <div class="apple-menu">
      <div
        class="menu-item"
        :class="{ active: store.focus && store.currentItem == index }"
        v-for="(item, index) in store.menus"
        :key="item.title"
        @click.stop="showMenu($event, index, item.options)"
        @mouseover="hoverShowMenu($event, index, item.options)"
      >
        <i v-if="item.titleTypes == 'icon'" class="icon iconfont" :class="[item.title]"></i>
        <span v-else>{{ item.title }}</span>
      </div>
    </div>
    <div class="apple-status">
      <div class="status-item">
        <i class="icon iconfont icon-ios-wifi"></i>
      </div>
      <div class="status-item">
        <i class="icon iconfont icon-ios-volume-high"></i>
      </div>
      <div class="status-item">
        <i class="icon iconfont icon-ios-bluetooth"></i>
      </div>
      <div class="status-item">
        <i class="icon iconfont icon-ios-search"></i>
      </div>
      <div class="status-item">{{ time }}</div>
    </div>
  </div>
  <div
    class="menu"
    v-if="store.focus"
    :style="{ left: menuPosition.x + 'px', top: menuPosition.y + 'px' }"
    @click.stop="() => null"
  >
    <div class="group" v-for="(group, index) in store.options" :key="'g' + index">
      <div class="menu-item" v-for="item in group" :key="item.title" @click.stop="item.event">
        {{ item.title }}
      </div>
    </div>
    <!-- <div class="group">
            <div class="menu-item">关于本机</div>
        </div>
        <div class="group">
            <div class="menu-item">系统偏好设置</div>
        </div>
        <div class="group">
            <div class="menu-item">重启本机</div>
            <div class="menu-item">关机</div>
        </div>
        <div class="group">
            <div class="menu-item">退出登陆</div>
        </div>-->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useStore } from './store'
import dayjs from 'dayjs'

const store = useStore()

const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

let time = ref(getTime())
let timeFrequency: number = 60 - Number(dayjs().format('ss'))
setInterval(() => {
  time.value = getTime()
  timeFrequency = 60 * 1000
}, timeFrequency)

function getTime(): string {
  let now = dayjs()
  let day = now.format('M[月]D[日]')
  let week = weekDays[now.day()]
  let time = now.format('HH:mm')
  return `${day} ${week} ${time}`
}

let menuPosition = reactive({ x: 0, y: 25 })

function showMenu(e: MouseEvent, index: number, options: any) {
  store.focus ? store.switchStatusBar(false) : store.switchStatusBar(true)
  store.clickMenuItem(index, options)
  menuPosition.x = e.pageX - e.offsetX
  document.addEventListener('click', hideMenu)
}
function hoverShowMenu(e: MouseEvent, index: number, options: any) {
  if (!store.focus || index === store.currentItem) return
  store.clickMenuItem(index, options)
  menuPosition.x = e.pageX - e.offsetX
  // document.addEventListener('click',hideMenu)
}
function hideMenu() {
  store.switchStatusBar(false)
  document.removeEventListener('click', hideMenu)
}

// function clickMenuItem(e:MouseEvent){
//      store.clickMenuItem(index,item.options)
// }
</script>

<style lang="scss" scoped>
.status-bar {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  height: 25px;
  color: white;
  z-index: 1999;
  padding: 0 10px;
  position: relative;
  box-sizing: border-box;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background-color: rgba($color: #000000, $alpha: 0.3);
  .apple-menu,
  .apple-status {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    .menu-item,
    .status-item {
      display: flex;
      height: 100%;
      margin: 0 -3px;
      cursor: default;
      user-select: none;
      padding: 0 16px;
      align-items: center;
      border-radius: 3px;
      &.active {
        background-color: rgba($color: white, $alpha: 0.3);
      }
      .icon {
        font-size: 16px;
        font-weight: bold;
        pointer-events: none;
      }
    }
  }
  .apple-status {
    justify-content: flex-end;
    .status-item {
      padding: 0 12px;
    }
  }
}
.menu {
  min-width: 200px;
  background-color: rgba($color: white, $alpha: 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: fixed;
  top: 25px;
  border-radius: 10px;
  padding: 0 5px;
  z-index: 1999;
  border: 1px solid #ddd;
  .group {
    padding: 5px 0;
    margin: 0 8px;
    border-bottom: 1px solid rgba($color: #ccc, $alpha: 0.8);
    &:nth-last-child(1) {
      border: none;
    }
  }
  .menu-item {
    // width: 100%;
    margin: 0 -8px;
    padding: 3px 8px;
    user-select: none;
    &:hover {
      background-color: rgb(10, 96, 255);
      border-radius: 6px;
      color: white;
    }
  }
}
</style>

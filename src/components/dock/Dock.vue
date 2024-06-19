<script setup lang="ts">
import { hoverDockItem, hoverDockItemLeave } from './hover'
import { useDockStore } from './DockStore'
import { type AppInfo } from '@/data/apps'
import { runApp as useRunApp } from '@/hook/useRunApp'

const dockApp = useDockStore()

const menuLeft = ref(0)

function rightClickDockItem(event: MouseEvent, index: number) {
  if (dockApp.showMenu) {
    dockApp.setMenuStatus(false)
    return
  }
  dockApp.setMenuStatus(true, false)
  dockApp.setActiveMenu(index)
  menuLeft.value = event.pageX - event.offsetX
}

function clickMenuItem(event: any) {
  dockApp.setMenuStatus(false)
  event.apply(dockApp)
}

function shouldShowMenuItem(menu: any): boolean {
  // if (menu?.open && dockApp.apps[dockApp.activeMenuAppIndex].active) return false
  // if (menu?.close && !dockApp.apps[dockApp.activeMenuAppIndex].active) return false
  return true
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
</script>

<template>
  <div class="dock">
    <div
      class="dock-item"
      @click="runApp(item)"
      @mousemove="hoverDockItem($event, dockApp.hoverable)"
      :data-index="index"
      @mouseleave="hoverDockItemLeave(dockApp.hoverable)"
      @contextmenu.prevent="rightClickDockItem($event, index)"
      v-for="(item, index) in dockApp.apps"
      :key="item.appId"
    >
      <div class="logo">
        <img class="w-full h-full" :src="item.icon" alt="icons" />
      </div>
      <div class="app-name" v-show="!dockApp.showMenu">{{ item.name }}</div>
    </div>
  </div>
  <!-- <div
    class="menu"
    v-if="dockApp.showMenu"
    :style="{ left: menuLeft + 'px' }"
    @click.stop="() => null"
  >
  </div> -->
</template>

<style lang="scss" scoped>
.dock {
  --transition-time: 120ms;
  position: relative;
  height: 60px;
  max-width: 96vw;
  background-color: rgba($color: white, $alpha: 0.4);
  backdrop-filter: blur(20px);
  border-radius: 10px;
  display: flex;
  align-items: center;
  transition: all var(--transition-time);
  z-index: 1999;
  --scale: 1;
  --icon-base-size: 50px;

  .dock-item {
    width: calc(var(--icon-base-size) * var(--scale));
    height: calc(var(--icon-base-size) * var(--scale));
    transition: all 15ms;
    padding: 10px 5px;
    flex-shrink: 0;
    position: relative;
    transform: all var(--transition-time);

    .logo {
      border-radius: 6px;
      // background-color: aqua;
      width: 100%;
      height: 100%;
      pointer-events: none;
      transform: translateY(calc(40px * calc(1 - var(--scale))));
      transition: all var(--transition-time);
    }

    .app-name {
      position: absolute;
      text-align: center;
      width: max-content;
      left: 50%;
      top: calc(calc(var(--icon-base-size) + 5px) * -1);
      display: none;
      padding: 3px 12px;
      border-radius: 5px;
      background-color: rgba($color: white, $alpha: 0.6);
      backdrop-filter: blur(20px);
      transform: translateX(-50%);
      pointer-events: none;
    }

    &:hover {
      .app-name {
        display: block;
      }
    }
    &:active {
      .logo::after {
        content: '';
        display: block;
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        bottom: 8px;
        background-color: rgba($color: black, $alpha: 0.5);
        border-radius: 16px;
      }
    }
  }
}

.menu {
  min-width: 200px;
  background-color: rgba($color: white, $alpha: 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: absolute;
  border-radius: 10px;
  padding: 0 5px;
  z-index: 1999;
  border: 1px solid #ddd;
  bottom: 90px;
  .group {
    padding: 5px 0;
    margin: 0 8px;
    border-bottom: 1px solid rgba($color: #ccc, $alpha: 0.8);
    &:nth-last-child(1) {
      border: none;
    }
  }

  .menu-item {
    margin: 0 -8px;
    padding: 3px 8px;
    user-select: none;
    &:hover {
      background-color: rgb(10, 96, 255);
      border-radius: 6px;
      color: white;
    }
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -21px;
    left: 24px;
    border-width: 10px;
    border-style: solid;
    border-color: rgba($color: white, $alpha: 0.5) transparent transparent transparent;
  }
}
</style>

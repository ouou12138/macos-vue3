<template>
  <div class="app" :class="{ active: props.active }" v-show="hide" :style="{ ...drag.moveResult.value }"
    @mousedown="clickApp">
    <div class="app-container" style="{'user-select':'none'}">
      <span v-for="dire in drag.Directions" :key="dire" :class="['resize-hanlder', 'resize-' + dire]"
        @mousedown="drag.dragResize($event, dire)"></span>
      <div class="nav-bar" v-show="props.showNav" @mousedown="drag.dragMove($event)"
        @dblclick.stop="drag.dbclickResize">
        <div class="control-container">
          <div class="controller close" @click.stop="closeApp"></div>
          <div class="controller minimize" @click.stop="minimizeApp"></div>
          <div class="controller maximize" @click.stop="maximizeApp"></div>
        </div>
        <div class="title-container" ref="titleContainerElement">
          <slot name="nav-bar">
            <div class="title">{{ props.appName }}</div>
          </slot>
        </div>
      </div>
      <div class="absolute top-1px left-1px right-1px bottom-1px"
        v-show="drag.isResizing.value || drag.isDraging.value"></div>
      <div class="sub-app" :style="{ height: appContentHeight + 'px' }" @mousedown="drag.dragMove($event)">
        <div class="control-container" v-if="!props.showNav">
          <div class="controller close" @click.stop="closeApp"></div>
          <div class="controller minimize" @click.stop="minimizeApp"></div>
          <div class="controller maximize" @click.stop="maximizeApp"></div>
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getQueue, setQueue, removeQueue, setActiveApp } from '@/hook/useRunApp'
import Drag from './drag'

type SizeLimition = {
  width: number
  height: number
}

const props = withDefaults(
  defineProps<{
    showNav?: boolean
    active?: boolean
    runningId?: string
    appId?: string
    appName?: string
    minSize?: SizeLimition
    maxSize?: SizeLimition
  }>(),
  {
    showNav: true,
    active: false,
    minSize: () => ({
      width: 0,
      height: 0
    }),
    maxSize: () => ({
      width: 0,
      height: 0
    })
  }
)

const appContentHeight = computed(() => {
  console.log(!props.showNav)

  return !props.showNav ? drag.windowInfo.h : drag.windowInfo.h - titleContainerHeight.value
})

const runningApp = getQueue(props.appId!)!

provide('isActive', props.active)
provide('closeApp', closeApp)
provide('minimizeApp', minimizeApp)
provide('maximizeApp', maximizeApp)

const limits = computed(() => ({
  minWidth: props.minSize.width ?? 0,
  minHeight: props.minSize.height ?? 0,
  maxWidth: props.maxSize.width ?? 0,
  maxHeight: props.maxSize.height ?? 0
}))

// rective data
const titleContainerElement = ref<HTMLElement | null>(null)
const titleContainerHeight = ref(0)

const hide = ref(true)

function closeApp() {
  removeQueue(props.appId!)
}

function minimizeApp() {
  hide.value = !hide.value
}

function maximizeApp() {
  drag.dbclickResize()
}

function clickApp() {
  setActiveApp(props.runningId!)
}

function getTitleContainerHeight() {
  let style = getComputedStyle(titleContainerElement.value as HTMLElement, null)
  titleContainerHeight.value = parseInt(style.height)
}

const drag: Drag = new Drag({
  resizeLimit: limits.value,
  titleContainerHeight: titleContainerHeight.value
})

defineExpose({
  minimizeApp,
  closeApp,
  maximizeApp
})

onMounted(() => {
  if (props.showNav) {
    getTitleContainerHeight()
    drag.setLimits({ titleContainerHeight: titleContainerHeight.value })
  }

  runningApp.wrapper = getCurrentInstance() as any
  setQueue(props.appId!, runningApp)
})
</script>

<style lang="scss" scoped>
.app {
  width: 800px;
  height: 400px;
  border-radius: 10px;
  overflow: hidden;
  position: fixed;
  box-shadow: 10px 10px 20px -5px rgba($color: #000, $alpha: 0.4);
  border: 1px solid rgba($color: #000, $alpha: 0.4);

  .app-container {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    // overflow: hidden;
    background-color: rgba($color: white, $alpha: 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
}

.app.active {
  z-index: 2000;
  box-shadow: 5px 20px 40px -5px rgba($color: #000, $alpha: 0.7);

  .controller {
    &::after {
      visibility: visible !important;
    }

    &.close {
      background-color: rgb(249, 69, 69);
    }

    &.minimize {
      background-color: rgb(252, 175, 36);
    }

    &.maximize {
      background-color: rgb(40, 162, 49);
    }
  }
}

.nav-bar {
  min-height: 30px;
  width: 100%;
  background-color: rgba($color: gray, $alpha: 0.7);
  display: flex;
  user-select: none;

  .title-container {
    flex: 1;
    width: 100%;
    height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;

    .title {
      font-size: 14px;
      color: white;
      margin-left: -80px;
    }
  }
}

.control-container {
  height: inherit;
  min-height: inherit;
  width: 80px;
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  &:hover {
    .controller {
      &::after {
        visibility: visible !important;
      }

      &.close {
        background-color: rgb(249, 69, 69);

        &::after {
          content: '\e8dd';
        }
      }

      &.minimize {
        background-color: rgb(252, 175, 36);

        &::after {
          content: '\e97f';
        }
      }

      &.maximize {
        background-color: rgb(40, 162, 49);

        &::after {
          content: '\e8e6';
          transform: rotateZ(45deg);
        }
      }
    }
  }

  .controller {
    --controller-size: 12px;
    width: var(--controller-size);
    height: var(--controller-size);
    border-radius: var(--controller-size);
    position: relative;
    text-align: center;
    background-color: #bbb;
    color: #666;
    transition: all 75ms;

    &::after {
      font-family: iconfont;
      position: absolute;
      left: 0;
      font-size: 14px;
      text-align: center;
      visibility: hidden;
    }
  }
}

.sub-app {
  width: 100%;
  height: max-content;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;

  .control-container {
    position: absolute;
    height: fit-content;
    padding: 10px 0;
    top: 0;
    left: 0;
  }
}

.resize-hanlder {
  display: inline-block;
  width: 10px;
  height: 10px;
  position: absolute;
  z-index: 10;
}

.resize-tl {
  top: -5px;
  left: -5px;
  cursor: nw-resize;
}

.resize-tm {
  width: calc(100% - 10px);
  top: -10px;
  margin: 0 10px;
  cursor: n-resize;
}

.resize-tr {
  top: -5px;
  right: -5px;
  cursor: ne-resize;
}

.resize-lm {
  height: calc(100% - 10px);
  left: -10px;
  cursor: w-resize;
}

.resize-rm {
  height: calc(100% - 10px);
  right: -10px;
  cursor: e-resize;
}

.resize-bl {
  bottom: -5px;
  left: -5px;
  cursor: sw-resize;
}

.resize-bm {
  width: calc(100% - 10px);
  bottom: -10px;
  cursor: s-resize;
}

.resize-br {
  bottom: -5px;
  right: -5px;
  cursor: se-resize;
}

[class*='resize-']:before {
  content: '';
  left: -2px;
  right: -2px;
  bottom: -2px;
  top: -2px;
  position: absolute;
  // background-color: black;
}
</style>

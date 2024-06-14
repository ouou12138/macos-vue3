<template>
  <div v-if="showApp" class="app" :style="{ ...drag.moveResult.value }">
    <div class="app-container" style="{'user-select':'none'}">
      <span
        v-for="dire in drag.Directions"
        :key="dire"
        :class="['resize-hanlder', 'resize-' + dire]"
        @mousedown="drag.dragResize($event, dire)"
      ></span>
      <div class="nav-bar" @mousedown="drag.dragMove($event)" @dblclick.stop="drag.dbclickResize">
        <div class="control-container">
          <div class="controller close" @click.stop="closeApp"></div>
          <div class="controller minimize"></div>
          <div class="controller maximize" @click.stop="drag.dbclickResize"></div>
        </div>
        <div class="title-container" ref="titleContainerElement">
          <slot name="nav-bar">
            <div class="title">{{ props.appName }}</div>
          </slot>
        </div>
      </div>
      <div
        class="absolute top-1px left-1px right-1px bottom-1px"
        v-show="drag.isResizing.value || drag.isDraging.value"
      ></div>
      <div class="sub-app" :style="{ height: drag.windowInfo.h - appTitleContainerHeight + 'px' }">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Drag from './drag'

type SizeLimition = {
  width: number
  height: number
}

const props = withDefaults(
  defineProps<{
    appName?: string
    minSize?: SizeLimition
    maxSize?: SizeLimition
  }>(),
  {
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

console.log(props.maxSize, 'props')

const limits = computed(() => ({
  minWidth: props.minSize.width ?? 0,
  minHeight: props.minSize.height ?? 0,
  maxWidth: props.maxSize.width ?? 0,
  maxHeight: props.maxSize.height ?? 0
}))

// rective data
let titleContainerElement = ref<HTMLElement | null>(null)
let titleContainerHeight = ref(0)

let showApp = ref(true)

//constant
let appTitleContainerHeight = 25

function closeApp() {
  showApp.value = false
}

function getTitleContainerHeight() {
  let style = getComputedStyle(titleContainerElement.value as HTMLElement, null)
  titleContainerHeight.value = parseInt(style.height)
}

let drag: Drag = new Drag({
  resizeLimit: limits.value,
  titleContainerHeight: titleContainerHeight.value
})

onMounted(() => {
  getTitleContainerHeight()
  drag.setLimits({ titleContainerHeight: titleContainerHeight.value })
})
</script>

<style lang="scss" scoped>
.app {
  width: 800px;
  height: 400px;
  border-radius: 10px;
  overflow: hidden;
  position: fixed;

  .app-container {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
    background-color: rgba($color: white, $alpha: 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
}

.nav-bar {
  min-height: 30px;
  width: 100%;
  background-color: rgba($color: gray, $alpha: 0.7);
  display: flex;
  user-select: none;

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
        }

        &.minimize {
          background-color: rgb(252, 175, 36);
        }

        &.maximize {
          background-color: rgb(40, 162, 49);
        }
      }
    }

    .controller {
      width: 14px;
      height: 14px;
      border-radius: 14px;
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

      &.close {
        &::after {
          content: '\e8dd';
        }
      }

      &.minimize {
        &::after {
          content: '\e97f';
        }
      }

      &.maximize {
        &::after {
          content: '\e8e6';
          transform: rotateZ(45deg);
        }
      }
    }
  }

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

.sub-app {
  width: 100%;
  height: max-content;
}

.resize-hanlder {
  display: inline-block;
  width: 10px;
  height: 10px;
  position: absolute;
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

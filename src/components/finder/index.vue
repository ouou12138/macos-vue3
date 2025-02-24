<template>
  <div class="w-full h-full flex">
    <div class="side-bar w-208px h-full flex flex-col">
      <div class="placeholder h-55px"></div>
      <div class="px-16px overflow-auto h-fit flex-1" @mousedown.stop="() => null">
        <div v-for="(category, index) in sideBarData" :key="index" class="not-first-of-type-pt-3 category">
          <div class="text-2.5 text-#666">{{ category.category }}</div>
          <ul class="items list-none m-0 text-3.25">
            <li v-for="(item, index) in category.items" :key="index" :class="{ active: activeName === item.name }"
              @click="() => (activeName = item.name)">
              <p class="icon"></p>
              {{ item.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="content flex-1 h-full flex flex-col">
      <div class="top-bar flex items-center box-border px-20px h-55px bg-#F6F8F7">
        <div class="text-3.8 text-200">{{ activeName }}</div>
      </div>
      <div class="flex-1 bg-white" @mousedown.stop="() => null"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const sideBarData = reactive([
  {
    category: '个人收藏',
    items: [
      {
        name: '最近使用',
        icon: ''
      },
      {
        name: '应用程序',
        icon: ''
      },
      {
        name: '桌面',
        icon: ''
      },
      {
        name: '下载',
        icon: ''
      }
    ]
  },
  {
    category: 'iCloud',
    items: [
      {
        name: 'iCloud云盘',
        icon: ''
      },
      {
        name: '共享',
        icon: ''
      }
    ]
  },
  {
    category: '位置',
    items: [
      {
        name: 'Data',
        icon: ''
      }
    ]
  }
])
const activeName = ref('最近使用')
</script>

<style lang="scss" scoped>
.side-bar {
  .category:nth-last-of-type() {
    padding-top: 20px;
  }

  .items {
    padding-left: 0;
    color: #333;

    li {
      padding: 3px 5px;
      display: flex;
      align-items: center;
      height: 20px;
      margin: 2px 0;

      .icon {
        width: 12px;
        height: 12px;
        border: 1px solid #0071f8;
        border-radius: 5px;
        margin-right: 5px;
      }

      &.active {
        background-color: rgba($color: #c8cbd0, $alpha: 0.6);
        border-radius: 5px;
      }
    }
  }
}
</style>

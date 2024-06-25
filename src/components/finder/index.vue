<template>
  <div class="w-full h-full flex">
    <div class="side-bar w-208px h-full flex flex-col">
      <div class="placeholder h-55px"></div>
      <div class="px-16px overflow-auto h-fit flex-1">
        <div class="not-first-of-type-pt-3 category">
          <div class="text-2.5 text-#666">个人收藏</div>
          <ul class="items list-none m-0 text-3.25">
            <li class="active">
              <p class="icon"></p>
              最近使用
            </li>
            <li>
              <p class="icon"></p>
              应用程序
            </li>
            <li>
              <p class="icon"></p>
              桌面
            </li>
            <li>
              <p class="icon"></p>
              下载
            </li>
            <li>
              <p class="icon"></p>
              下载
            </li>
          </ul>
        </div>
        <div class="not-first-of-type-pt-3 category">
          <div class="text-2.5 text-#666">iCloud</div>
          <ul class="items list-none m-0 text-3.25">
            <li>
              <p class="icon"></p>
              iCloud云盘
            </li>
            <li>
              <p class="icon"></p>
              共享
            </li>
          </ul>
        </div>
        <div class="not-first-of-type-pt-3 category">
          <div class="text-2.5 text-#666">位置</div>
          <ul class="items list-none m-0 text-3.25">
            <li>
              <p class="icon"></p>
              Data
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="content bg-white flex-1 h-full" @mousemove.stop></div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
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
      padding: 5px;
      display: flex;
      align-items: center;
      height: 20px;
      .icon {
        width: 12px;
        height: 12px;
        border: 1px solid #0071f8;
        border-radius: 5px;
        margin-right: 5px;
      }
      &.active {
        background-color: #c8cbd0;
        border-radius: 5px;
      }
    }
  }
}
</style>

<script setup>
import { createApp } from "vue";
import { Terminal } from "@b52405/webterminal"
import "@b52405/webterminal/dist/style.css"
const terminalWrapper = ref < HTMLDivElement > (null)


const TermApp = createApp(Terminal);
onMounted(() => {
  console.log(terminalWrapper.value);

  // terminalWrapper.value.appendChild(TermApp);
})
</script>

<template>
  <div id="terminal-wrapper" ref="terminalWrapper"></div>
</template>
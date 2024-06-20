import { nanoid } from 'nanoid'
import apps from '@/data/apps'
import Desktop from '@/components/desktop/desktop.vue'
import appContainer from '@/components/app-container/app-container.vue'
import { render, type VNode } from 'vue'

type QueueItem = {
  runningId: string
  wrapper?: typeof appContainer
  vnode?: VNode
}

export const runningQueue = reactive(new Map<string, QueueItem>())

export const activeApp = ref<string>('')

let DesktopComponent: null | InstanceType<typeof Desktop> = null

export const setQueue = (appId: string, value?: QueueItem) => {
  if (!runningQueue.has(appId) && value) {
    runningQueue.set(appId, value)
  }

  return runningQueue.get(appId)
}

export const getQueue = (appId: string) => {
  return runningQueue.get(appId)
}

export const removeQueue = (appId: string) => {
  return runningQueue.delete(appId)
}

export const setActiveApp = (runningId: string) => {
  activeApp.value = runningId
}

export const runApp = async <T = Record<string, any>>(APP_KEY: string, props?: T) => {
  const appDefine = apps.find((e) => e.key === APP_KEY)
  if (!appDefine) throw new Error('app define not found')
  const runningInfo = getQueue(appDefine.appId)
  if (runningInfo) {
    runningInfo.wrapper?.exposed.minimizeApp()
    setActiveApp(runningInfo.runningId)
    return runningInfo.runningId
  }
  const runningId = nanoid(16)
  if (!appDefine.component_path) throw new Error('app component not found')
  const appComp = defineAsyncComponent(() => import(`../components/${appDefine.key}/index.vue`))
  const appWrapper = h(
    appContainer,
    {
      key: runningId,
      runningId,
      appId: appDefine.appId,
      appName: appDefine.name,
      ...(appDefine.window_config || {})
    },
    h(appComp, props || {})
  )

  setQueue(appDefine.appId, { runningId, vnode: appWrapper })
  let desktopEl = DesktopComponent!.$el
  if (!desktopEl) desktopEl = document.querySelector('.desktop') || document.body
  // render(appWrapper, desktopEl)
  setActiveApp(runningId)
  return runningId
}

export const initDesktop = (intance: InstanceType<typeof Desktop>) => {
  DesktopComponent = intance
}

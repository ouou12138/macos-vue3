import { nanoid } from 'nanoid'
import apps from '@/data/apps'
import Desktop from '@/components/desktop/desktop.vue'
import appContainer from '@/components/app-container/app-container.vue'
import { type VNode } from 'vue'
import useMenuStore from '@/stores/statusMenu'
import useMenu from './useMenu'

type QueueItem = {
  runningId: string
  appKey: string
  wrapper?: typeof appContainer
  vnode?: VNode
}

export const runningQueue = reactive(new Map<string, QueueItem>())

export const activeApp = ref<string>('')

let DesktopComponent: null | InstanceType<typeof Desktop> = null

export const initDesktop = (intance: InstanceType<typeof Desktop>) => {
  DesktopComponent = intance
}

export const useRunApp = () => {
  const { setMenu } = useMenu()
  const setQueue = (appId: string, value?: QueueItem) => {
    if (!runningQueue.has(appId) && value) {
      runningQueue.set(appId, value)
    }
    return runningQueue.get(appId)
  }

  const getQueue = (appId: string) => {
    return runningQueue.get(appId)
  }

  const removeQueue = (appId: string) => {
    const queueItem = getQueue(appId)
    if (queueItem) {
      setMenu(queueItem.runningId, [])
    }
    return runningQueue.delete(appId)
  }

  const setActiveApp = (runningId: string) => {
    const menuStore = useMenuStore()
    activeApp.value = runningId
    menuStore.setActiveMenu(runningId)
  }

  const importAppComponent = (key: string) => {
    return defineAsyncComponent(() => import(`../components/${key}/index.vue`))
  }

  const loadMenu = async (appid: string) => {
    try {
      const appInfo = getQueue(appid)
      if (!appInfo) throw new Error('app not found')
      const data = await import(`../components/${appInfo?.appKey}/menu`)
      setMenu(appInfo.runningId, data.default)
    } catch (error: any) {
      console.error(`找不到该应用(${appid})菜单`, error)
      setMenu(appid, [])
    }
  }

  const runApp = async <T = Record<string, any>>(APP_KEY: string, props?: T) => {
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
    const appComp = importAppComponent(appDefine.key)
    const appWrapper = h(
      appContainer,
      {
        key: runningId,
        runningId,
        appId: appDefine.appId,
        appName: appDefine.name,
        ...(appDefine.window_config || {})
      },
      () => h(appComp, props || {})
    )

    setQueue(appDefine.appId, { runningId, appKey: appDefine.key, vnode: appWrapper })
    let desktopEl = DesktopComponent!.$el
    if (!desktopEl) desktopEl = document.querySelector('.desktop') || document.body
    // render(appWrapper, desktopEl)
    loadMenu(appDefine.appId)
    setActiveApp(runningId)
    return runningId
  }

  return {
    setQueue,
    getQueue,
    removeQueue,
    setActiveApp,
    runApp
  }
}

export default useRunApp

interface DesktopInfo {
  width: number
  height: number
  statusbarHeight: number
  dockHeight: number
}

export const useDesktopStore = defineStore('desktop', () => {
  const desktopInfo = reactive<DesktopInfo>({
    width: window.screen.width ?? 1920,
    height: window.screen.height || 1080,
    statusbarHeight: 25,
    dockHeight: 55
  })

  const setDesktopInfo = (info: Partial<DesktopInfo>) => {
    desktopInfo.dockHeight = info.dockHeight || 55
    desktopInfo.width = info.width || 1920
    desktopInfo.height = info.height || 1080
    desktopInfo.statusbarHeight = info.statusbarHeight || 25
  }

  const onWindowSize = () => {
    console.log(window.innerWidth)

    desktopInfo.height = window.innerHeight
    desktopInfo.width = window.innerWidth
  }

  window.addEventListener('resize', onWindowSize)
  onWindowSize()

  return {
    desktopInfo,
    setDesktopInfo
  }
})

declare global {
  interface Window {
    switchLaunchpad: () => void
    isShowLaunchpad: Ref<boolean>
  }
}

export {}

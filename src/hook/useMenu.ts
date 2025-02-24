import useMenuStore from '@/stores/statusMenu'

const useMenu = () => {
  const menuStore = useMenuStore()

  const setMenu = (runningId: string, menus: MenuList) => {
    menuStore.addMenu(runningId, menus)
    menuStore.setActiveMenu(runningId)
  }

  return { setMenu }
}

export default useMenu

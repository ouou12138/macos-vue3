import { defineStore } from 'pinia'

const useMenuStore = defineStore('menustore', () => {
  const menuList = reactive<{ [id: string]: MenuList }>({})

  const activeMenu = ref<MenuList>([])

  const addMenu = (runningId: string, menu: MenuList) => {
    menuList[runningId] = menu
  }

  const setActiveMenu = (runningId: string) => {
    activeMenu.value = menuList[runningId] || []
  }

  return { activeMenu, addMenu, setActiveMenu }
})

export default useMenuStore

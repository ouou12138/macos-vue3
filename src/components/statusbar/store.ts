import useMenuStore from '@/stores/statusMenu'
import { defineStore } from 'pinia'

export const useStore = defineStore('statusbar', () => {
  const focus = ref(false)
  const currentItem = ref(0)
  const menus = ref<MenuItems>([])
  const menuList = ref<MenuList>([])
  const menuStore = useMenuStore()

  menuStore.$subscribe((_, state) => {
    menuList.value = state.activeMenu
  })

  const switchStatusBar = (status: boolean) => {
    focus.value = status
  }
  const clickMenuItem = (index: number, _menus: MenuItems) => {
    currentItem.value = index
    menus.value = _menus
  }

  return { focus, currentItem, menus, menuList, switchStatusBar, clickMenuItem }
})

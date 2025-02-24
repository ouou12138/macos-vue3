import { Component } from 'vue'

declare global {
  interface MenuItem {
    /** 菜单标题,和render二选一，render优先 */
    title?: string
    render?: () => Component
    titleTypes?: 'icon' | 'string'
    key: string
    children?: MenuItem[]
  }

  interface MenuListItem {
    title: string
    titleTypes?: 'icon' | 'string'
    menus: MenuItems
  }

  type MenuItems = MenuItem[][]

  type MenuList = MenuListItem[]
}

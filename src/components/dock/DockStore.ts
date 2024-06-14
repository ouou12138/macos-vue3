import { default as appsList, type MenuItem } from '@/data/apps'

type DockApp = typeof appsList extends Array<infer U> ? U : never
// interface DockApp {
//   active: boolean;
//   name: string;
//   icon: string;
//   appId: string;
//   appInfo: AppInfo;
//   menus: MenuItem[][];
// }

// interface AppInfo {
//   name: string;
//   width: number;
//   height: number;
//   positionX: number;
//   positionY: number;
// }

// const optMenu: MenuItem[][] = [
//   [
//     {
//       title: '从程序坞中移除',
//       event: function (this: any) {
//         this.apps.splice(this.activeMenuAppIndex, 1)
//       }
//     },
//     {
//       title: '打开',
//       event: function () {
//         console.log(this)
//         console.log('退出')
//       },
//       open: true
//     },
//     {
//       title: '退出',
//       event: function () {
//         console.log('退出')
//       },
//       close: true
//     }
//   ]
// ]

export const useDockStore = defineStore('dockStore', () => {
  const apps = appsList
  const hoverable = ref<boolean>(true)
  const showMenu = ref(false)
  const activeMenu = ref(new Array<MenuItem[]>())
  const activeMenuAppIndex = ref(0)

  const pushApp = (app: DockApp) => {
    // app.menus.concat(optMenu)
  }

  const setMenuStatus = (menu: boolean, _hoverable: boolean = true) => {
    hoverable.value = _hoverable
    showMenu.value = menu
  }

  const setActiveMenu = (index: number) => {
    // activeMenu.value = apps[index].menus
    // activeMenuAppIndex.value = index
  }
  return {
    apps,
    hoverable,
    showMenu,
    activeMenu,
    activeMenuAppIndex,
    pushApp,
    setMenuStatus,
    setActiveMenu
  }
})

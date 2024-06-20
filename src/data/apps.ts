import { nanoid } from 'nanoid'
import '../assets/app_icons/accessibility-inspector-2023-05-22.png'
const appIcons = import.meta.glob<true, string, any>('../assets/app_icons/*', {
  eager: true
})

const iconsLinks = Object.fromEntries(
  Object.entries(appIcons).map(([key, value]) => [
    key
      .replace(/\\/g, '/')
      .replace(/.*\//, '') // remove path
      .replace(/-\d+/g, '')
      .replace(/\.\w+/, ''), // remove extension
    value.default
  ])
)

export interface MenuItem {
  title: string
  options?: MenuItem[][]
  event?: Function
  [propname: string]: any
}

type SizeLimition = {
  width: number
  height: number
}

export type AppInfo = {
  name: string
  key: string
  icon: string
  appId: string
  menus: MenuItem[]
  component_path?: string
  render?: Function
  window_config?: {
    minSize?: SizeLimition
    maxSize?: SizeLimition
    showNav?: boolean
  }
}

const apps: AppInfo[] = [
  {
    name: '访达',
    icon: iconsLinks['finder'],
    key: 'finder',
    appId: nanoid(16),
    component_path: '../components/finder/index.vue',
    menus: []
  },
  {
    name: '启动台',
    icon: iconsLinks['launchpad'],
    key: 'launchpad',
    appId: nanoid(16),
    render: () => {
      ;(window as any).switchLaunchpad()
    },
    menus: []
  },
  {
    name: '计算器',
    icon: iconsLinks['calculator'],
    key: 'calculator',
    appId: nanoid(16),
    component_path: '../components/calculator/index.vue',
    menus: [],
    window_config: {
      minSize: {
        width: 230,
        height: 325
      },
      maxSize: {
        width: 230,
        height: 325
      },
      showNav: false
    }
  },
  {
    name: 'Safari 浏览器',
    icon: iconsLinks['safari'],
    key: 'safari',
    appId: nanoid(16),
    component_path: '../components/safari/index.vue',
    menus: []
  },
  {
    name: '终端',
    icon: iconsLinks['terminal'],
    key: 'terminal',
    appId: nanoid(16),
    component_path: '../components/terminal/index.vue',
    menus: []
  },
  {
    name: '家庭',
    icon: iconsLinks['home'],
    key: 'home',
    appId: nanoid(16),
    component_path: '../components/home/index.vue',
    menus: []
  },
  {
    name: 'Siri',
    icon: iconsLinks['siri'],
    key: 'siri',
    appId: nanoid(16),
    component_path: '../components/siri/index.vue',
    menus: []
  },
  {
    name: '系统设置',
    icon: iconsLinks['system-preferences'],
    key: 'system-preferences',
    appId: nanoid(16),
    component_path: '../components/system-preferences/index.vue',
    menus: []
  },
  {
    name: '提醒事项',
    icon: iconsLinks['reminders'],
    key: 'reminders',
    appId: nanoid(16),
    component_path: '../components/reminders/index.vue',
    menus: []
  },
  {
    name: '便笺',
    icon: iconsLinks['stickies'],
    key: 'stickies',
    appId: nanoid(16),
    component_path: '../components/stickies/index.vue',
    menus: []
  }
]
export default apps

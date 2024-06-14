import { defineStore } from 'pinia'

// interface StateTypes {
//   focus: boolean;
//   menus: Array<MenuItem>;
//   currentItem: number;
//   options: Options;
// }
interface MenuItem {
  title: string
  titleTypes?: string
  options: Options
}
interface Options {
  title: string
  event: Function
}

export const useStore = defineStore('statusbar', {
  state: () => ({
    focus: false,
    menus: [
      {
        title: 'icon-apple',
        titleTypes: 'icon',
        options: [
          [
            {
              title: '关于本机',
              event: () => {
                console.log(123)
              }
            }
          ],
          [
            {
              title: '系统偏好设置',
              event: () => {
                console.log(1234)
              }
            }
          ],
          [
            {
              title: '重启本机',
              event: () => {
                console.log(1234)
              }
            },
            {
              title: '关机',
              event: () => {
                console.log(1234)
              }
            }
          ],
          [
            {
              title: '退出登录',
              event: () => {
                console.log(1234)
              }
            }
          ]
        ]
      },
      {
        title: 'code',
        options: [
          [
            {
              title: '关于 studio code code code code',
              event: () => {
                console.log(123)
              }
            },
            {
              title: '检查更新',
              event: () => {
                console.log(1235)
              }
            }
          ],
          [
            {
              title: '首选项',
              event: () => {
                console.log(1234)
              }
            }
          ]
        ]
      },
      {
        title: 'code2',
        options: [
          [
            {
              title: '关于 studio code',
              event: () => {
                console.log(123)
              }
            },
            {
              title: '检查更新',
              event: () => {
                console.log(1235)
              }
            }
          ],
          [
            {
              title: '首选项',
              event: () => {
                console.log(1234)
              }
            }
          ]
        ]
      }
    ],
    currentItem: 0,
    options: [
      [
        {
          event: () => {},
          title: ''
        }
      ]
    ]
  }),
  actions: {
    switchStatusBar(status: boolean) {
      this.focus = status
    },
    clickMenuItem(index: number, options: any) {
      this.options = options
      this.currentItem = index
    }
  }
})

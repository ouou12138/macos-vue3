import { useDockStore } from './DockStore'
const scale = 0.8
export const hoverDockItem = function (e: MouseEvent, hoverable: boolean = true): void {
  if (!hoverable) {
    document.addEventListener('click', listenWindowClick)
    return
  }
  //base scale rate

  const item = e.target as HTMLElement
  const itemRect = item.getBoundingClientRect()
  const offset: number = Number((Math.abs(e.clientX - itemRect.left) / itemRect.width).toFixed(3))

  const prev = (item.previousElementSibling as HTMLElement) || null
  const next = (item.nextElementSibling as HTMLElement) || null

  //reset all app scale
  resetScale()
  //set dock body max-with
  setDockWidth('none')
  //set prev app scale
  if (prev) {
    setStyleProperty(prev, '--scale', (1 + scale * Math.abs(offset - 1)).toString())
  }
  //set current app scale
  setStyleProperty(item, '--scale', (1 + scale).toString())

  //set next app scale
  if (next) {
    setStyleProperty(next, '--scale', (1 + scale * offset).toString())
  }
}
function setStyleProperty(element: HTMLElement, property: string, value: string): void {
  element.style.setProperty(property, value)
}

function resetScale() {
  const dockItems = document.querySelectorAll('.dock-item') as NodeListOf<HTMLElement>
  dockItems.forEach((element) => {
    setStyleProperty(element, '--scale', '1')
  })
}

function setDockWidth(width: string) {
  const dock = <HTMLElement>document.querySelector('.dock')
  if (dock) {
    setStyleProperty(dock, 'max-width', width)
  }
}

export const hoverDockItemLeave = function (hoverable: boolean = true): void {
  if (!hoverable) {
    document.addEventListener('click', listenWindowClick)
    return
  }
  resetScale()
  setDockWidth('90vw')
}

function listenWindowClick() {
  const dockApp = useDockStore()
  dockApp.setMenuStatus(false)
  hoverDockItemLeave(dockApp.hoverable)
  document.removeEventListener('click', listenWindowClick)
}

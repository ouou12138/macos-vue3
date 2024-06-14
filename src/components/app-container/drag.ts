import { ref, reactive, computed } from 'vue'
import { useDesktopStore } from '../finder/desktopStore'

type ResizeLimit = {
  minWidth: number
  maxWidth: number
  minHeight: number
  maxHeight: number
}

enum DirectionsEnum {
  'tl' = 'tl',
  'tm' = 'tm',
  'tr' = 'tr',
  'lm' = 'lm',
  'rm' = 'rm',
  'bl' = 'bl',
  'bm' = 'bm',
  'br' = 'br'
}
const Directions = [
  DirectionsEnum.tl,
  DirectionsEnum.tm,
  DirectionsEnum.tr,
  DirectionsEnum.lm,
  DirectionsEnum.rm,
  DirectionsEnum.bl,
  DirectionsEnum.bm,
  DirectionsEnum.br
]

type Bounds = {
  minLeft: number
  minTop: number
  minRight: number
  minBottom: number
  maxLeft: number
  maxTop: number
  maxRight: number
  maxBottom: number
}
type MousePosition = {
  mouseX: number
  mouseY: number
  left: number
  right: number
  top: number
  bottom: number
}

interface Params {
  titleContainerHeight?: number
  resizeLimit?: ResizeLimit
}

class Drag {
  private mouseClickPosition = reactive<MousePosition>({
    mouseX: 0,
    mouseY: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  })
  private bounds: Bounds = {
    minLeft: 0,
    minTop: 0,
    minRight: 0,
    minBottom: 0,
    maxLeft: 0,
    maxTop: 0,
    maxRight: 0,
    maxBottom: 0
  }

  private resizeDirection: DirectionsEnum = DirectionsEnum.tr

  private titleContainerHeight = 0
  private desktopArea = {
    width: 1920,
    height: 1080,
    statusbarHeight: 25,
    dockHeight: 55
  }

  public Directions = Directions

  private defaultPosition = reactive({
    x: 300,
    y: 100
  })
  private resizeLimit: ResizeLimit = {
    minWidth: 400,
    minHeight: 600,
    maxWidth: 0,
    maxHeight: 0
  }
  public windowInfo = reactive({
    x: this.defaultPosition.x,
    y: this.defaultPosition.y,
    w: this.resizeLimit.minWidth,
    h: this.resizeLimit.minHeight
  })
  private windowPosition = reactive({
    left: this.defaultPosition.x,
    top: this.defaultPosition.y,
    right: 0,
    bottom: 0
  })
  private tempWindowPositionAndSize = { ...this.windowInfo, ...this.windowPosition }
  private fullScreen = false

  public moveResult = computed(() => ({
    transform: `translate(${this.windowInfo.x}px,${this.windowInfo.y}px)`,
    width: this.windowInfo.w + 'px',
    height: this.windowInfo.h + 'px',
    transition: this.fullScreen ? 'all 300ms line' : 'none'
  }))

  public isDraging = ref(false)
  public isResizing = ref(false)
  //构造函数
  constructor(params?: Params) {
    const deskstopStore = useDesktopStore()
    this.desktopArea.width = deskstopStore.desktopInfo.width
    this.desktopArea.height = deskstopStore.desktopInfo.height

    const { width: winWidth, height: winHeight } = this.desktopArea

    deskstopStore.$subscribe((mutations, state) => {
      this.desktopArea = state.desktopInfo
      this.resizeLimit.maxWidth = this.desktopArea.width
      this.resizeLimit.maxHeight = this.desktopArea.height
    })

    if (params?.resizeLimit) {
      const resizeLimit = this.resizeLimit
      const paramsResizeLimit = params.resizeLimit
      resizeLimit.maxWidth <= 0
        ? (resizeLimit.maxWidth = this.desktopArea.width)
        : paramsResizeLimit.maxWidth
      resizeLimit.maxHeight <= 0
        ? (resizeLimit.maxHeight = this.desktopArea.height)
        : paramsResizeLimit.maxHeight
      paramsResizeLimit.minWidth && (resizeLimit.minWidth = paramsResizeLimit.minWidth)
      paramsResizeLimit.minHeight && (resizeLimit.minHeight = paramsResizeLimit.minHeight)
    }

    this.titleContainerHeight = params?.titleContainerHeight || 0

    this.handleDrag = this.handleDrag.bind(this)
    this.handleUp = this.handleUp.bind(this)
    this.handleResize = this.handleResize.bind(this)

    this.windowPosition.right = winWidth - this.windowInfo.x - this.resizeLimit.minWidth
    this.windowPosition.bottom = winHeight - this.windowInfo.y - this.resizeLimit.minHeight

    this.calcResizeLimit()
  }

  public addEvent(
    el: HTMLElement | Window | undefined,
    event: string,
    hanlder: any,
    params: any = {}
  ) {
    if (!el) return
    el.addEventListener(event, hanlder, params)
  }
  public removeEvent(
    el: HTMLElement | Window | undefined,
    event: string,
    hanlder: any,
    params: any = {}
  ) {
    if (!el) return
    el.removeEventListener(event, hanlder, params)
  }
  private getRealOffset(target: number, min: number, max: number) {
    if (min > 0 && target < min) {
      return min
    } else if (max > 0 && target > max) {
      return max
    } else {
      return target
    }
  }

  public setLimits(params: Params) {
    if (params.resizeLimit) {
      this.resizeLimit = params.resizeLimit
    }

    this.titleContainerHeight = params?.titleContainerHeight || 0
  }

  private calcWindowPosition(pageX: number, pageY: number) {
    const { left, top, right, bottom } = this.windowPosition

    const { mouseClickPosition } = this
    mouseClickPosition.mouseX = pageX
    mouseClickPosition.mouseY = pageY
    mouseClickPosition.left = left
    mouseClickPosition.top = top
    mouseClickPosition.right = right
    mouseClickPosition.bottom = bottom
  }
  private calcResizeLimit() {
    const { bounds, resizeLimit, windowPosition, windowInfo, desktopArea } = this
    const { minWidth, minHeight, maxWidth, maxHeight } = resizeLimit

    const { left, top, right, bottom } = windowPosition

    const { w, h } = windowInfo
    const { width: deskWidth, height: deskHeight } = desktopArea

    bounds.minLeft = 0
    bounds.minTop = 0
    bounds.minRight = 0
    bounds.minBottom = 0
    bounds.maxLeft = left + Math.floor(w - (minWidth ? minWidth : 0))
    bounds.maxRight = right + Math.floor(w - (minWidth ? minWidth : 0))
    bounds.maxTop = top + Math.floor(h - (minHeight ? minHeight : 0))
    bounds.maxBottom = bottom + Math.floor(h - (minHeight ? minHeight : 0))

    if (maxWidth) {
      bounds.minLeft = Math.max(bounds.minLeft, deskWidth - right - maxWidth)
      bounds.minRight = Math.max(bounds.minRight, deskWidth - left - maxWidth)
    }
    if (maxHeight) {
      bounds.minTop = Math.max(bounds.minTop, deskHeight - bottom - maxHeight)
      bounds.minBottom = Math.max(bounds.minBottom, deskHeight - top - maxHeight)
    }
  }

  public dragMove(e: MouseEvent) {
    if (e.button != 0) return
    this.mouseClickPosition.mouseX = e.pageX - this.windowInfo.x
    this.mouseClickPosition.mouseY = e.pageY - this.windowInfo.y
    this.addEvent(window, 'mousemove', this.handleDrag)
    this.addEvent(window, 'mouseup', this.handleUp)
  }
  private handleDrag(e: MouseEvent) {
    const { pageX, pageY } = e
    const { mouseX, mouseY } = this.mouseClickPosition
    const { width: deskWidth, height: deskHeight, dockHeight } = this.desktopArea
    const offsetX = pageX - mouseX

    const offsetY = this.getRealOffset(pageY - mouseY, 0, deskHeight + dockHeight)
    this.windowInfo.x = offsetX
    this.windowInfo.y = offsetY
    this.windowPosition.left = offsetX
    this.windowPosition.top = offsetY
    this.windowPosition.right = deskWidth - offsetX - this.windowInfo.w
    this.windowPosition.bottom = deskHeight - offsetY - this.windowInfo.h
    this.isDraging.value = true
  }
  private handleUp() {
    this.fixWindowVertPosition()
    this.removeEvent(window, 'mousemove', this.handleDrag)
    this.removeEvent(window, 'mousemove', this.handleResize)
    this.removeEvent(window, 'mouseup', this.handleUp)
    this.isDraging.value = false
    this.isResizing.value = false
  }
  private fixWindowVertPosition() {
    const { windowInfo, desktopArea, titleContainerHeight } = this
    windowInfo.y = Math.min(
      desktopArea.height -
        titleContainerHeight -
        desktopArea.statusbarHeight -
        desktopArea.dockHeight,
      windowInfo.y
    )
  }

  public dragResize(e: MouseEvent, direction: DirectionsEnum): void {
    if (e.button != 0) return
    const { pageX, pageY } = e
    this.resizeDirection = direction
    this.calcWindowPosition(pageX, pageY)
    this.calcResizeLimit()

    this.addEvent(window, 'mousemove', this.handleResize)
    this.addEvent(window, 'mouseup', this.handleUp)
    this.isResizing.value = true
  }

  private handleResize(e: MouseEvent) {
    const {
      mouseClickPosition,
      windowPosition,
      windowInfo,
      bounds,
      desktopArea,
      resizeDirection,
      getRealOffset
    } = this
    const { pageX, pageY } = e
    const {
      mouseX,
      mouseY,
      left: mouseLeft,
      right: mouseRight,
      top: mouseTop,
      bottom: mouseBottom
    } = mouseClickPosition
    const offsetX = pageX - mouseX
    const offsetY = pageY - mouseY
    let { left, right, top, bottom } = windowPosition

    const direc = resizeDirection
    if (direc.includes('l')) {
      left = getRealOffset(mouseLeft + offsetX, bounds.minLeft, bounds.maxLeft)
    } else if (direc.includes('r')) {
      right = getRealOffset(mouseRight - offsetX, bounds.minRight, bounds.maxRight)
    }
    if (direc.includes('t')) {
      top = getRealOffset(mouseTop + offsetY, bounds.minTop, bounds.maxTop)
    } else if (direc.includes('b')) {
      bottom = getRealOffset(mouseBottom - offsetY, bounds.minBottom, bounds.maxBottom)
    }

    windowInfo.w = desktopArea.width - left - right
    windowInfo.h = desktopArea.height - top - bottom
    windowPosition.left = windowInfo.x = left
    windowPosition.top = windowInfo.y = top
    windowPosition.right = right
    windowPosition.bottom = bottom
  }
  public dbclickResize() {
    const {
      desktopArea,
      tempWindowPositionAndSize: tempWinPosSize,
      windowInfo,
      windowPosition
    } = this
    const wWidth = desktopArea.width,
      wHeight = desktopArea.height
    this.fullScreen = true
    if (
      wWidth == windowInfo.w &&
      wHeight == windowInfo.h &&
      windowInfo.x == 0 &&
      windowInfo.y == 0
    ) {
      windowInfo.x = tempWinPosSize.x
      windowInfo.y = tempWinPosSize.y
      windowInfo.w = tempWinPosSize.w
      windowInfo.h = tempWinPosSize.h
      windowPosition.left = tempWinPosSize.left
      windowPosition.top = tempWinPosSize.top
      windowPosition.right = tempWinPosSize.right
      windowPosition.bottom = tempWinPosSize.bottom
    } else {
      this.tempWindowPositionAndSize = { ...windowInfo, ...windowPosition }
      windowInfo.x = 0
      windowInfo.y = 0
      windowInfo.w = desktopArea.width
      windowInfo.h = desktopArea.height
      windowPosition.left = 0
      windowPosition.top = 0
      windowPosition.right = 0
      windowPosition.bottom = 0
    }
    setTimeout(() => {
      this.fullScreen = false
    }, 300)
  }
  public maximalWindow() {
    const {
      desktopArea,
      tempWindowPositionAndSize: tempWinPosSize,
      windowInfo,
      windowPosition
    } = this
    const wWidth = desktopArea.width,
      wHeight = desktopArea.height
    if (
      wWidth == windowInfo.w &&
      wHeight == windowInfo.h &&
      windowInfo.x == 0 &&
      windowInfo.y == 0
    ) {
      windowInfo.x = tempWinPosSize.x
      windowInfo.y = tempWinPosSize.y
      windowInfo.w = tempWinPosSize.w
      windowInfo.h = tempWinPosSize.h
      windowPosition.left = tempWinPosSize.left
      windowPosition.top = tempWinPosSize.top
      windowPosition.right = tempWinPosSize.right
      windowPosition.bottom = tempWinPosSize.bottom
    } else {
      this.tempWindowPositionAndSize = { ...windowInfo, ...windowPosition }
      windowInfo.x = 0
      windowInfo.y = -desktopArea.statusbarHeight
      windowInfo.w = desktopArea.width
      windowInfo.h = desktopArea.height + desktopArea.statusbarHeight + desktopArea.dockHeight
      windowPosition.left = 0
      windowPosition.top = -desktopArea.statusbarHeight
      windowPosition.right = 0
      windowPosition.bottom = -desktopArea.dockHeight
    }
  }
}

export default Drag

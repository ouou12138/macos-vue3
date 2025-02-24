<template>
  <div class="calculator">
    <div class="screen" :style="{ fontSize: screentFontSize + 'px' }" ref="screen">
      {{ displayNum }}
    </div>
    <div class="keyboard" @mousedown.stop>
      <div class="key text-5" :class="{
        'grid-col-span-2': key === '0',
        normal: !yellowKeys.includes(key) && !specKeys.includes(key),
        'bg-#FF9F0A': yellowKeys.includes(key),
        'bg-#fff/15': specKeys.includes(key)
      }" v-for="key in inputKeys" :key="key" @click="clickKey(key)">
        {{ key }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import useMenu from '@/hook/useMenu';
// import menu from './menu';

const screen = ref<HTMLDivElement | null>()
let screenWidth = 200
const screentFontSize = ref(48)
const inputKeys = ref([
  'AC',
  '+/-',
  '%',
  '÷',
  '7',
  '8',
  '9',
  'x',
  '4',
  '5',
  '6',
  '-',
  '1',
  '2',
  '3',
  '+',
  '0',
  '.',
  '='
])
const specKeys = ref(['AC', 'C', '+/-', '%'])
const yellowKeys = ref(['÷', 'x', '-', '+', '='])

const displayNum = ref('0')
let tempNum: string | null = null
let tempNum2: string | null = null
let flag: string | null = null
let lastArr: [string, string, string] | null = null
const isAC = ref(true)
watch(isAC, () => {
  if (isAC.value) {
    inputKeys.value[0] = 'AC'
  } else {
    inputKeys.value[0] = 'C'
  }
})

// const runningId = inject<string>('runningId')

// const { setMenu } = useMenu()

// setMenu(runningId!, menu)

const renderDisplayNum = (input?: string) => {
  displayNum.value = input === 'Infinity' ? '不是数字' : input || '0'
  if (displayNum.value.length > 5) {
    //最小字体 20px，最大字体 48px，计算的数字最长约为 12 位

    let size = Math.floor(screenWidth / displayNum.value.length - 5)
    if (size < 20) size = 20
    screentFontSize.value = size
  } else {
    screentFontSize.value = 48
  }
}

const clickKey = (key: string) => {
  switch (key) {
    case 'AC':
      if (lastArr !== null) {
        lastArr = null
      }
      renderDisplayNum()
      return
    case 'C':
      flag = null
      tempNum = null
      tempNum2 = null
      isAC.value = true
      renderDisplayNum()
      return
    case '+/-':
      tempNum2 = String(-Number(tempNum2))
      renderDisplayNum(tempNum2)
      return
    case '%':
      tempNum2 = String(Number(tempNum2) / 100)
      renderDisplayNum(tempNum2)
      return
  }

  if (!yellowKeys.value.includes(key)) {
    tempNum2 = tempNum2 === null || tempNum2 === '0' ? key : tempNum2 + key
    renderDisplayNum(tempNum2)
    lastArr = null
    isAC.value = false
    return
  }
  if (key === '=') {
    let count: string
    if ((tempNum === null || tempNum2 === null || flag === null) && lastArr) {
      count = String(calculate(...lastArr!))
      lastArr && (lastArr[0] = count)
    } else {
      count = String(calculate(tempNum!, tempNum2!, flag!))
      lastArr = [count!, tempNum2!, flag!]
      tempNum = null
      tempNum2 = null
      flag = null
    }
    renderDisplayNum(count)
    tempNum = count
    return
  }

  if (!flag) tempNum = tempNum2
  tempNum2 = '0'
  if (key === '÷') {
    flag = '/'
  } else if (key === 'x') {
    flag = '*'
  } else if (key === '-') {
    flag = '-'
  } else if (key === '+') {
    flag = '+'
  }
}

function calculate(num1?: string, num2?: string, flag?: string) {
  let _num1 = Number(num1)
  let _num2 = Number(num2)

  if (!flag) return _num2
  if (!_num1) return _num2

  switch (flag) {
    case '/':
      return _num1 / _num2
    case '*':
      return _num1 * _num2
    case '-':
      return _num1 - _num2
    case '+':
      return _num1 + _num2
    default:
      return _num1
  }
}
onMounted(() => {
  const screenEl = screen.value
  screenWidth = Number(getComputedStyle(screenEl as HTMLElement).width.replace('px', ''))
})
</script>

<style lang="scss" scoped>
.calculator {
  background-color: rgba($color: #000000, $alpha: 0.7);
  display: flex;
  flex-direction: column;
  height: inherit;
}

.screen {
  height: 80px;
  font-size: 48px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  color: white;
  width: 100%;
  flex: 1;
  font-weight: 200;
  padding: 0 12px;
  box-sizing: border-box;
  pointer-events: none;
  user-select: none;
}

.keyboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 48px);
  width: 100%;
  color: white;
  gap: 1px;
}

.key {
  display: flex;
  justify-content: center;
  align-items: center;

  &.normal {
    background-color: rgba($color: #eee, $alpha: 0.28);
  }

  &:active {
    background-color: rgba($color: #eee, $alpha: 0.68);
  }
}
</style>

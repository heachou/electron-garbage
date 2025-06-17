import { TRegisterConfigNames } from '@/main/data'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export const callApi = window.electron.invoke

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 克，转 千克，保留 1 位小数, 不足 1 千克的，保留 2 位小数
export const convertToKg = (g: number = 0) => {
  const kg = g / 1000
  if (kg < 1) {
    return parseFloat(kg.toFixed(2))
  } else {
    return parseFloat(kg.toFixed(1))
  }
}

export const toDouble = (num: number) => {
  if (num < 10) {
    return `0${num}`
  }
  return `${num}`
}

export const genHourMinute = (hour: number = 0, minute: number = 0) => {
  return `${toDouble(hour)}:${toDouble(minute)}`
}

export const generateDoorTimeConfigForAllDoors = (
  putterState: Record<TRegisterConfigNames, ParsedData> | null | undefined
) => {
  console.log('putterState', putterState)
  if (!putterState) {
    return undefined // 或者返回一个默认的空配置结构
  }

  const doors: Record<
    'door1' | 'door2' | 'door3' | 'door4',
    Array<{ startTime: string; endTime: string }>
  > = {
    door1: [],
    door2: [],
    door3: [],
    door4: []
  }
  for (let i = 1; i <= 4; i++) {
    const doorKey = `door${i}` as 'door1' | 'door2' | 'door3' | 'door4'
    doors[doorKey] = []
    for (let j = 1; j <= 4; j++) {
      const startTime = `${genHourMinute(putterState?.[`门${i}开始小时${j}` as TRegisterConfigNames]?.value as number, putterState?.[`门${i}开始分钟${j}` as TRegisterConfigNames]?.value as number)}`
      const endTime = `${genHourMinute(putterState?.[`门${i}关闭小时${j}` as TRegisterConfigNames]?.value as number, putterState?.[`门${i}关闭分钟${j}` as TRegisterConfigNames]?.value as number)}`
      doors[doorKey].push({ startTime, endTime })
    }
  }
  return doors
}

// 判断当前的时间是否在给定的时间范围内
export const isTimeInRange = (startTime: string, endTime: string, currentTime: string) => {
  // 解析时间字符串
  const [startHour, startMin] = startTime.split(':')
  const [endHour, endMin] = endTime.split(':')
  const start = dayjs().set('hour', Number(startHour)).set('minute', Number(startMin))
  const end = dayjs().set('hour', Number(endHour)).set('minute', Number(endMin))
  const current = dayjs(currentTime)

  // 校验解析是否成功
  if (!start.isValid() || !end.isValid() || !current.isValid()) {
    console.error('提供给 isTimeInRange 的时间格式无效:', { startTime, endTime, currentTime })
    return false // 或者根据您的错误处理策略抛出错误
  }

  const isAfterOrSameAsStart = current.isSame(start, 'minute') || current.isAfter(start, 'minute')
  const isBeforeOrSameAsEnd = current.isSame(end, 'minute') || current.isBefore(end, 'minute')
  return isAfterOrSameAsStart && isBeforeOrSameAsEnd
}

export const createFixedLengthArray = (arr: number[], fixedLength: number = 12): number[] => {
  const result = new Array(fixedLength).fill(0)
  for (let i = 0; i < Math.min(arr.length, fixedLength); i++) {
    result[i] = arr[i]
  }
  return result
}

export function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
    .replace(/[018]/g, (c) =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    )
    .replace(/-/g, '')
}

export function numberToChinese(num: number): string {
  console.log('🚀 ~ numberToChinese ~ num:', num)
  const chineseNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const chineseUnit = ['', '十', '百', '千', '万', '亿']

  if (typeof num !== 'number' || isNaN(num)) {
    return '请输入有效的数字'
  }

  let prefix = ''
  let processNum = num
  if (processNum < 0) {
    prefix = '负'
    processNum = -processNum // 转换为正数进行处理
  }

  const numStr = String(processNum)
  const [integerPartStr, decimalPartStr] = numStr.split('.')

  if (integerPartStr.length > 6) {
    return '整数部分最多处理6位数字'
  }

  let integerChinese = ''
  if (Number(integerPartStr) === 0 && decimalPartStr) {
    integerChinese = '零'
  } else if (Number(integerPartStr) !== 0) {
    let zeroFlag = false // 用于标记是否连续出现零
    for (let i = 0; i < integerPartStr.length; i++) {
      const digit = parseInt(integerPartStr[i])
      const unitPosition = integerPartStr.length - 1 - i

      if (digit === 0) {
        zeroFlag = true
      } else {
        if (zeroFlag) {
          integerChinese += '零'
          zeroFlag = false
        }
        // 特殊处理 '一十' 为 '十'
        if (!(digit === 1 && unitPosition === 1 && integerPartStr.length <= 2 && i === 0)) {
          integerChinese += chineseNum[digit]
        }
        integerChinese += chineseUnit[unitPosition]
      }
    }
    // 如果末尾是零，则去除
    if (integerChinese.endsWith('零') && integerPartStr.length > 1) {
      integerChinese = integerChinese.slice(0, -1)
    }
  }

  let decimalChinese = ''
  if (decimalPartStr) {
    for (let i = 0; i < decimalPartStr.length; i++) {
      decimalChinese += chineseNum[parseInt(decimalPartStr[i])]
    }
  }

  // 处理 0 和 -0 的情况，确保它们都输出 '零'
  if (num === 0) {
    return '零'
  }

  if (integerChinese === '' && decimalChinese === '') {
    // 这种情况理论上在 num === 0 时已经处理，但为了保险起见保留
    return prefix + '零'
  }
  if (integerChinese === '' && decimalChinese !== '') {
    return prefix + '零点' + decimalChinese
  }
  if (integerChinese !== '' && decimalChinese !== '') {
    return prefix + integerChinese + '点' + decimalChinese
  }
  return prefix + integerChinese
}

export function identifyAllGarbage(
  text: string,
  garbageKindList: Record<
    'kitchenWaste' | 'hazardousWaste' | 'recyclableWaste' | 'otherWaste',
    string[]
  >
): GarbageInfo[] {
  const allGarbageTypes = [
    { type: '厨余垃圾', list: [...garbageKindList.kitchenWaste, '厨余垃圾'] },
    { type: '可回收物', list: [...garbageKindList.recyclableWaste, '可回收物'] },
    { type: '有害垃圾', list: [...garbageKindList.hazardousWaste, '有害垃圾'] },
    { type: '其他垃圾', list: [...garbageKindList.otherWaste, '其他垃圾'] }
  ]

  const foundItems: GarbageInfo[] = []

  for (const garbageCategory of allGarbageTypes) {
    for (const item of garbageCategory.list) {
      if (text.includes(item)) {
        foundItems.push({ type: garbageCategory.type, name: item })
      }
    }
  }

  return foundItems
}

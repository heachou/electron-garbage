export const registerConfigs = [
  { address: 0, name: '当前烟雾', dataType: 'uint16', readOnly: true },
  { address: 1, name: '当前温度', dataType: 'int16', decimalPoints: 1, unit: '℃', readOnly: true },
  { address: 2, name: '烟雾报警阈值', dataType: 'uint16', readOnly: false },
  { address: 3, name: '烟雾报警标志', dataType: 'bool', readOnly: true },
  {
    address: 4,
    name: '温度报警阈值',
    dataType: 'uint16',
    decimalPoints: 1,
    unit: '℃',
    readOnly: false
  },
  { address: 5, name: '温度报警标志', dataType: 'bool', readOnly: true },
  { address: 6, name: '语音音量大小', dataType: 'uint16', readOnly: false, min: 0, max: 30 },
  {
    address: 7,
    name: '循环报警时间间隔',
    dataType: 'uint16',
    unit: '秒',
    readOnly: false,
    min: 1,
    max: 60
  },
  { address: 8, name: '满仓报警是否亮灯', dataType: 'bool', readOnly: false },
  { address: 9, name: '烟雾报警是否亮灯', dataType: 'bool', readOnly: false },
  { address: 10, name: '温度报警是否亮灯', dataType: 'bool', readOnly: false },
  { address: 11, name: '满仓是否语音播报', dataType: 'bool', readOnly: false },
  // 时间参数组1-4
  {
    address: 12,
    name: '伸出时间1',
    dataType: 'uint16',
    decimalPoints: 1,
    unit: '秒',
    readOnly: false,
    min: 1,
    max: 60
  },
  {
    address: 13,
    name: '开门保持时间1',
    dataType: 'uint16',
    decimalPoints: 1,
    unit: '秒',
    readOnly: false,
    min: 1,
    max: 60
  },
  {
    address: 14,
    name: '关门停顿时间1',
    dataType: 'uint16',
    decimalPoints: 1,
    unit: '秒',
    readOnly: false,
    min: 1,
    max: 60
  },
  {
    address: 15,
    name: '伸出时间2',
    dataType: 'uint16',
    decimalPoints: 1,
    unit: '秒',
    readOnly: false,
    min: 1,
    max: 60
  },
  {
    address: 16,
    name: '开门保持时间2',
    dataType: 'uint16',
    decimalPoints: 1,
    unit: '秒',
    readOnly: false,
    min: 1,
    max: 60
  },
  {
    address: 17,
    name: '关门停顿时间2',
    dataType: 'uint16',
    decimalPoints: 1,
    unit: '秒',
    readOnly: false,
    min: 1,
    max: 60
  },
  {
    address: 18,
    name: '伸出时间3',
    dataType: 'uint16',
    decimalPoints: 1,
    unit: '秒',
    readOnly: false,
    min: 1,
    max: 60
  },
  {
    address: 19,
    name: '开门保持时间3',
    dataType: 'uint16',
    decimalPoints: 1,
    unit: '秒',
    readOnly: false,
    min: 1,
    max: 60
  },
  {
    address: 20,
    name: '关门停顿时间3',
    dataType: 'uint16',
    decimalPoints: 1,
    unit: '秒',
    readOnly: false,
    min: 1,
    max: 60
  },
  {
    address: 21,
    name: '伸出时间4',
    dataType: 'uint16',
    decimalPoints: 1,
    unit: '秒',
    readOnly: false,
    min: 1,
    max: 60
  },
  {
    address: 22,
    name: '开门保持时间4',
    dataType: 'uint16',
    decimalPoints: 1,
    unit: '秒',
    readOnly: false,
    min: 1,
    max: 60
  },
  {
    address: 23,
    name: '关门停顿时间4',
    dataType: 'uint16',
    decimalPoints: 1,
    unit: '秒',
    readOnly: false,
    min: 1,
    max: 60
  },
  // 系统时间
  { address: 24, name: '当前时间小时', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 25, name: '当前时间分钟', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 26, name: '当前时间秒', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  // 门控模块1（地址30-51）
  { address: 30, name: '门1开门指令', dataType: 'bool', readOnly: false },
  { address: 31, name: '门1满仓报警', dataType: 'bool', readOnly: true },
  { address: 32, name: '门1定时使能1', dataType: 'bool', readOnly: false },
  { address: 33, name: '门1定时使能2', dataType: 'bool', readOnly: false },
  { address: 34, name: '门1定时使能3', dataType: 'bool', readOnly: false },
  { address: 35, name: '门1定时使能4', dataType: 'bool', readOnly: false },
  { address: 36, name: '门1开始小时1', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 37, name: '门1开始小时2', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 38, name: '门1开始小时3', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 39, name: '门1开始小时4', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 40, name: '门1开始分钟1', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 41, name: '门1开始分钟2', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 42, name: '门1开始分钟3', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 43, name: '门1开始分钟4', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 44, name: '门1关闭小时1', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 45, name: '门1关闭小时2', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 46, name: '门1关闭小时3', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 47, name: '门1关闭小时4', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 48, name: '门1关闭分钟1', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 49, name: '门1关闭分钟2', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 50, name: '门1关闭分钟3', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 51, name: '门1关闭分钟4', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  // 门控模块2（地址52-73）
  { address: 52, name: '门2开门指令', dataType: 'bool', readOnly: false },
  { address: 53, name: '门2满仓报警', dataType: 'bool', readOnly: true },
  { address: 54, name: '门2定时使能1', dataType: 'bool', readOnly: false },
  { address: 55, name: '门2定时使能2', dataType: 'bool', readOnly: false },
  { address: 56, name: '门2定时使能3', dataType: 'bool', readOnly: false },
  { address: 57, name: '门2定时使能4', dataType: 'bool', readOnly: false },
  { address: 58, name: '门2开始小时1', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 59, name: '门2开始小时2', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 60, name: '门2开始小时3', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 61, name: '门2开始小时4', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 62, name: '门2开始分钟1', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 63, name: '门2开始分钟2', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 64, name: '门2开始分钟3', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 65, name: '门2开始分钟4', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 66, name: '门2关闭小时1', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 67, name: '门2关闭小时2', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 68, name: '门2关闭小时3', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 69, name: '门2关闭小时4', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 70, name: '门2关闭分钟1', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 71, name: '门2关闭分钟2', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 72, name: '门2关闭分钟3', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 73, name: '门2关闭分钟4', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  // 门控模块3（地址74-95）
  { address: 74, name: '门3开门指令', dataType: 'bool', readOnly: false },
  { address: 75, name: '门3满仓报警', dataType: 'bool', readOnly: true },
  { address: 76, name: '门3定时使能1', dataType: 'bool', readOnly: false },
  { address: 77, name: '门3定时使能2', dataType: 'bool', readOnly: false },
  { address: 78, name: '门3定时使能3', dataType: 'bool', readOnly: false },
  { address: 79, name: '门3定时使能4', dataType: 'bool', readOnly: false },
  { address: 80, name: '门3开始小时1', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 81, name: '门3开始小时2', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 82, name: '门3开始小时3', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 83, name: '门3开始小时4', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 84, name: '门3开始分钟1', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 85, name: '门3开始分钟2', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 86, name: '门3开始分钟3', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 87, name: '门3开始分钟4', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 88, name: '门3关闭小时1', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 89, name: '门3关闭小时2', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 90, name: '门3关闭小时3', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 91, name: '门3关闭小时4', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 92, name: '门3关闭分钟1', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 93, name: '门3关闭分钟2', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 94, name: '门3关闭分钟3', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 95, name: '门3关闭分钟4', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  // 门控模块4（地址96-117） // 注释修正为 门控模块4
  { address: 96, name: '门4开门指令', dataType: 'bool', readOnly: false },
  { address: 97, name: '门4满仓报警', dataType: 'bool', readOnly: true },
  { address: 98, name: '门4定时使能1', dataType: 'bool', readOnly: false },
  { address: 99, name: '门4定时使能2', dataType: 'bool', readOnly: false },
  { address: 100, name: '门4定时使能3', dataType: 'bool', readOnly: false },
  { address: 101, name: '门4定时使能4', dataType: 'bool', readOnly: false },
  { address: 102, name: '门4开始小时1', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 103, name: '门4开始小时2', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 104, name: '门4开始小时3', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 105, name: '门4开始小时4', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 106, name: '门4开始分钟1', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 107, name: '门4开始分钟2', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 108, name: '门4开始分钟3', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 109, name: '门4开始分钟4', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 110, name: '门4关闭小时1', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 111, name: '门4关闭小时2', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 112, name: '门4关闭小时3', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 113, name: '门4关闭小时4', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 114, name: '门4关闭分钟1', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 115, name: '门4关闭分钟2', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 116, name: '门4关闭分钟3', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 117, name: '门4关闭分钟4', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  // 照明定时控制 (地址 118, 119 在表格中为 "无", 已跳过)
  {
    address: 120,
    name: '定时照明使能',
    dataType: 'uint16',
    readOnly: false,
    min: 0,
    max: 2,
    options: [
      { label: '不启用', value: 0 },
      { label: '启用', value: 1 },
      { label: '触发机制', value: 2 }
    ]
  },
  { address: 121, name: '开启小时', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 122, name: '开启分钟', dataType: 'uint16', readOnly: false, min: 0, max: 59 },
  { address: 123, name: '关闭小时', dataType: 'uint16', readOnly: false, min: 0, max: 23 },
  { address: 124, name: '关闭分钟', dataType: 'uint16', readOnly: false, min: 0, max: 59 }
] as const

export type TRegisterConfigNames = (typeof registerConfigs)[number]['name']

export enum MEDIA_TYPE {
  // 全屏广告
  app_ads_slider = 'app_ads_slider',
  // 首页广告
  app_home_slider = 'app_home_slider'
}

export const weightDeviceConfig = [
  {
    address: 0,
    name: '当前重量 1',
    dataType: 'uint16',
    unit: 'KG',
    decimalPoints: 3,
    readOnly: true,
    registerCount: 2
  },
  {
    address: 2,
    name: '当前重量 2',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 2,
    unit: 'KG',
    decimalPoints: 3
  },
  {
    address: 4,
    name: '当前重量 3',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 2,
    unit: 'KG',
    decimalPoints: 3
  },
  {
    address: 6,
    name: '当前重量 4',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 2,
    unit: 'KG',
    decimalPoints: 3
  },
  {
    address: 8,
    name: '当前重量 5',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 2,
    unit: 'KG',
    decimalPoints: 3
  },
  {
    address: 10,
    name: '当前重量 6',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 2,
    unit: 'KG',
    decimalPoints: 3
  },
  {
    address: 12,
    name: '当前重量 7',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 2,
    unit: 'KG',
    decimalPoints: 3
  },
  {
    address: 14,
    name: '当前重量 8',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 2,
    unit: 'KG',
    decimalPoints: 3
  },
  {
    address: 16,
    name: '当前重量 9',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 2,
    unit: 'KG',
    decimalPoints: 3
  },
  {
    address: 18,
    name: '当前重量 10',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 2,
    unit: 'KG',
    decimalPoints: 3
  },
  {
    address: 20,
    name: '当前重量 11',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 2,
    unit: 'KG',
    decimalPoints: 3
  },
  {
    address: 22,
    name: '当前重量 12',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 2,
    unit: 'KG',
    decimalPoints: 3
  },
  {
    address: 24,
    name: '当前重量 13',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 2,
    unit: 'KG',
    decimalPoints: 3
  },
  {
    address: 26,
    name: '当前重量 14',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 2,
    unit: 'KG',
    decimalPoints: 3
  },
  {
    address: 28,
    name: '当前重量 15',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 2,
    unit: 'KG',
    decimalPoints: 3
  },
  {
    address: 30,
    name: '当前重量 16',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 2,
    unit: 'KG',
    decimalPoints: 3
  },
  {
    address: 32,
    name: '砝码校正',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 2,
    description: '砝码校正值，可读可写。写入案例: 01 10 00 20 00 02 04 00 00 03 E8 F1 09 (写入1KG)'
  },
  {
    address: 34,
    name: '当前零位',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 2,
    description: '读取当前零位值'
  },
  {
    address: 36,
    name: '当前 AD',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 2,
    description: '读取当前AD值'
  },
  {
    address: 38,
    name: '零点校正(置零)',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: '置零/清零操作'
  },
  {
    address: 39,
    name: '选择通道',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description:
      '选择1-16路，写入的值对应选择的通道号。读取时也返回当前选择的通道。例如选择1路，寄存1路。'
  },
  {
    address: 40,
    name: '波特率',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description:
      '设置或读取波特率。选项: 1 (2400), 2 (4800), 3 (9600), 4 (19200), 5 (28800), 6 (38400), 7 (57600), 8 (115200)。默认3 (9600)',
    options: [
      { value: 1, label: '2400' },
      { value: 2, label: '4800' },
      { value: 3, label: '9600 (默认)' },
      { value: 4, label: '19200' },
      { value: 5, label: '28800' },
      { value: 6, label: '38400' },
      { value: 7, label: '57600' },
      { value: 8, label: '115200' }
    ]
  },
  {
    address: 41,
    name: '模块地址',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: '设置或读取模块地址 (1-127)。默认01。'
  },
  {
    address: 42,
    name: '追零使能',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description:
      '设置或读取追零使能状态。选项: 0 (关闭), 1 (开启，关闭状态), 2 (开启，开机有重量), 3 (开启，开机无重量)。',
    options: [
      { value: 0, label: '关闭' },
      { value: 1, label: '开启(关闭状态)' },
      { value: 2, label: '开启(开机有重量)' },
      { value: 3, label: '开启(开机无重量)' }
    ]
  },
  {
    address: 43,
    name: '动态跟踪范围',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: '设置或读取动态跟踪范围。选项: 0 (关闭), 1 (1级防抖), 2 (2级防抖), 3 (3级防抖)。',
    options: [
      { value: 0, label: '关闭' },
      { value: 1, label: '1级防抖' },
      { value: 2, label: '2级防抖' },
      { value: 3, label: '3级防抖' }
    ]
  },
  {
    address: 44,
    name: 'CRC效验高低位切换',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: '设置或读取CRC效验高低位切换状态。选项: 0 (恢复), 1 (切换)。',
    options: [
      { value: 0, label: '恢复' },
      { value: 1, label: '切换' }
    ]
  },
  {
    address: 45,
    name: '去皮',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: '设置或读取去皮状态。选项: 1 (去皮), 2 (恢复去皮)。',
    options: [
      { value: 1, label: '去皮' },
      { value: 2, label: '恢复去皮' }
    ]
  },
  {
    address: 46,
    name: '重量保持',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: '设置或读取重量保持状态。选项: 0 (不保存), 1 (关机前1保存)。',
    options: [
      { value: 0, label: '不保存' },
      { value: 1, label: '关机前1保存' }
    ]
  },
  {
    address: 47,
    name: '分度值',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: '设置或读取分度值。选项: 0, 1, 2, 5, 10, 20, 50, 100。默认1。',
    options: [
      { value: 0, label: '0' },
      { value: 1, label: '1 (默认)' },
      { value: 2, label: '2' },
      { value: 5, label: '5' },
      { value: 10, label: '10' },
      { value: 20, label: '20' },
      { value: 50, label: '50' },
      { value: 100, label: '100' }
    ]
  },
  {
    address: 48,
    name: '抗蠕变',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description:
      '设置或读取抗蠕变。如果用于测量连续抽液体，滴水等环境，请写入0关闭抗蠕变。选项: 0-50。默认1。',
    optionsType: 'range',
    min: 0,
    max: 50,
    default: 1
  },
  {
    address: 49,
    name: '追零范围',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: '设置或读取追零范围。选项: 1-50。默认2。',
    optionsType: 'range',
    min: 1,
    max: 50,
    default: 2
  },
  {
    address: 50,
    name: '小数点',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: '设置或读取小数点位数。选项: 0, 1, 2, 3。默认3。',
    options: [
      { value: 0, label: '0' },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3 (默认)' }
    ]
  },
  {
    address: 51,
    name: '重量模式切换',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: '设置或读取重量模式。选项: 0, 1, 2, 3, 4, 5, 6。默认0。',
    options: [
      { value: 0, label: '模式0 (默认)' },
      { value: 1, label: '模式1' },
      { value: 2, label: '模式2' },
      { value: 3, label: '模式3' },
      { value: 4, label: '模式4' },
      { value: 5, label: '模式5' },
      { value: 6, label: '模式6' }
    ]
  },
  {
    address: 52,
    name: '滤波速度',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: '设置或读取滤波速度。选项: 0, 1, 2, 3。默认0。',
    options: [
      { value: 0, label: '速度0 (默认)' },
      { value: 1, label: '速度1' },
      { value: 2, label: '速度2' },
      { value: 3, label: '速度3' }
    ]
  },
  {
    address: 53,
    name: '字序切换',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: '设置或读取字序切换。选项: 0 (默认), 1 (切换)。',
    options: [
      { value: 0, label: '默认' },
      { value: 1, label: '切换' }
    ]
  },
  {
    address: 54,
    name: '指示灯闪',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 1,
    description: '读取指示灯闪烁状态。重量不稳定0, 稳定1。',
    options: [
      { value: 0, label: '重量不稳定' },
      { value: 1, label: '稳定' }
    ]
  },
  {
    address: 55,
    name: '发送间隔',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: '发送间隔。默认1 (50MS)。范围1-100。',
    min: 1,
    max: 100,
    default: 1
  },
  {
    address: 56, // 0x0038
    name: 'ADC 数量',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: '需接传感器的数量。默认16。范围1-16路。',
    min: 1,
    max: 16,
    default: 16
  },
  {
    address: 57, // 0x0039
    name: '零点漂移',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: '零点漂移。默认0。范围1-1000。',
    min: 0,
    max: 1000,
    default: 0
  },
  {
    address: 58, // 0x003a
    name: '系数',
    readOnly: false,
    registerCount: 2,
    description: '系数。默认100000。',
    default: 100000
  },
  {
    address: 60, // 0x003c
    name: '实际重量',
    readOnly: true,
    registerCount: 2,
    description: '实际重量。默认0。',
    default: 0
  },
  {
    address: 62, // 0x003e
    name: 'XK3190-DS10协议',
    readOnly: false,
    registerCount: 1,
    description: 'XK3190-DS10协议。默认0切换1。',
    default: 0,
    options: [
      { value: 0, label: '状态0' },
      { value: 1, label: '状态1 (切换)' }
    ]
  },
  {
    address: 63, // 0x003f
    name: '多路置零',
    readOnly: false, // It's an action, so likely write-only or read/write with specific meaning
    registerCount: 2,
    description: '多路置零。置零1路2路。'
    // This seems like an action rather than a persistent setting with a range.
    // The value written might specify which channels to zero.
    // For now, no min/max/default. The value written would be specific to the action.
  },
  {
    address: 65, // 0x0041
    name: '多路去皮',
    readOnly: false, // Action, similar to multi-zero
    registerCount: 2,
    description: '多路去皮。去皮1路2路。'
  },
  {
    address: 67, // 0x0043
    name: '零点追踪时间',
    dataType: 'uint16', // 00 0a is unusual for a uint16, but description implies a selection
    readOnly: false,
    registerCount: 1, // Assuming 1 register based on typical simple settings
    description: '零点追踪时间。1=0.05MS, 10=0.5秒。默认10。',
    default: 10,
    options: [
      { value: 1, label: '0.05MS' },
      { value: 10, label: '0.5秒' }
      // Other values might be possible but are not specified
    ]
  },
  {
    address: 68, // 0x0044
    name: '1路 AD值',
    dataType: 'uint32', // 00 02 indicates 2 registers
    readOnly: true,
    registerCount: 2,
    description: '1路 AD值。'
  },
  {
    address: 70, // 0x0046
    name: '2路 AD值',
    dataType: 'uint32',
    readOnly: true,
    registerCount: 2,
    description: '2路 AD值。'
  },
  {
    address: 72, // 0x0048
    name: '3路 AD值',
    dataType: 'uint32',
    readOnly: true,
    registerCount: 2,
    description: '3路 AD值。'
  },
  {
    address: 74, // 0x004a
    name: '4路 AD值',
    dataType: 'uint32',
    readOnly: true,
    registerCount: 2,
    description: '4路 AD值。'
  },
  {
    address: 76, // 0x004c
    name: '5路 AD值',
    dataType: 'uint32',
    readOnly: true,
    registerCount: 2,
    description: '5路 AD值。'
  },
  {
    address: 78, // 0x004e
    name: '6路 AD值',
    dataType: 'uint32',
    readOnly: true,
    registerCount: 2,
    description: '6路 AD值。'
  },
  {
    address: 80, // 0x0050
    name: '7路 AD值',
    dataType: 'uint32',
    readOnly: true,
    registerCount: 2,
    description: '7路 AD值。'
  },
  {
    address: 82, // 0x0052
    name: '8路 AD值',
    dataType: 'uint32',
    readOnly: true,
    registerCount: 2,
    description: '8路 AD值。'
  },
  {
    address: 84, // 0x0054
    name: '9路 AD值',
    dataType: 'uint32',
    readOnly: true,
    registerCount: 2,
    description: '9路 AD值。'
  },
  {
    address: 86, // 0x0056
    name: '10路 AD值',
    dataType: 'uint32',
    readOnly: true,
    registerCount: 2,
    description: '10路 AD值。'
  },
  {
    address: 88, // 0x0058
    name: '11路 AD值',
    dataType: 'uint32',
    readOnly: true,
    registerCount: 2,
    description: '11路 AD值。'
  },
  {
    address: 90, // 0x005a
    name: '12路 AD值',
    dataType: 'uint32',
    readOnly: true,
    registerCount: 2,
    description: '12路 AD值。'
  },
  {
    address: 92, // 0x005c
    name: '13路 AD值',
    dataType: 'uint32',
    readOnly: true,
    registerCount: 2,
    description: '13路 AD值。'
  },
  {
    address: 94, // 0x005e
    name: '14路 AD值',
    dataType: 'uint32',
    readOnly: true,
    registerCount: 2,
    description: '14路 AD值。'
  },
  {
    address: 96, // 0x0060
    name: '15路 AD值',
    dataType: 'uint32',
    readOnly: true,
    registerCount: 2,
    description: '15路 AD值。'
  },
  {
    address: 98, // 0x0063
    name: '16路 AD值',
    dataType: 'uint32',
    readOnly: true,
    registerCount: 2,
    description: '16路 AD值。'
  },
  {
    address: 100, // 0x0065
    name: '1路清零',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 1,
    description: '1路清零。'
  },
  {
    address: 101, // 0x0066
    name: '2路清零',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 1,
    description: '2路清零。'
  },
  {
    address: 102, // 0x0067
    name: '3路清零',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 1,
    description: '3路清零。'
  },
  {
    address: 103, // 0x0068
    name: '4路清零',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 1,
    description: '4路清零。'
  },
  {
    address: 104, // 0x0069
    name: '5路清零',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 1,
    description: '5路清零。'
  },
  {
    address: 105, // 0x006a
    name: '6路清零',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 1,
    description: '6路清零。'
  },
  {
    address: 106, // 0x006b
    name: '7路清零',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 1,
    description: '7路清零。'
  },
  {
    address: 107, // 0x006c
    name: '8路清零',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 1,
    description: '8路清零。'
  },
  {
    address: 108, // 0x006d
    name: '9路清零',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 1,
    description: '9路清零。'
  },
  {
    address: 109, // 0x006e
    name: '10路清零',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 1,
    description: '10路清零。'
  },
  {
    address: 110, // 0x006f
    name: '11路清零',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 1,
    description: '11路清零。'
  },
  {
    address: 111, // 0x0070
    name: '12路清零',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 1,
    description: '12路清零。'
  },
  {
    address: 112, // 0x0071
    name: '13路清零',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 1,
    description: '13路清零。'
  },
  {
    address: 113, // 0x0072
    name: '14路清零',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 1,
    description: '14路清零。'
  },
  {
    address: 114, // 0x0073
    name: '15路清零',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 1,
    description: '15路清零。'
  },
  {
    address: 115, // 0x0073
    name: '16路清零',
    dataType: 'uint16',
    readOnly: true,
    registerCount: 1,
    description: '16路清零。'
  },
  {
    address: 116, // 0x0075
    name: '1路校正',
    dataType: 'uint32',
    readOnly: false,
    registerCount: 2,
    description: '1路校正（1000克）。',
    options: [
      { value: 0, label: '0克' },
      { value: 1000, label: '1000克' },
      { value: 5000, label: '5000克' }
    ]
  },
  {
    address: 118, // 0x0077
    name: '2路校正',
    dataType: 'uint32',
    readOnly: false,
    registerCount: 2,
    description: '2路校正。',
    options: [
      { value: 0, label: '0克' },
      { value: 1000, label: '1000克' },
      { value: 5000, label: '5000克' }
    ]
  },
  {
    address: 120, // 0x0079
    name: '3路校正',
    dataType: 'uint32',
    readOnly: false,
    registerCount: 2,
    description: '3路校正。',
    options: [
      { value: 0, label: '0克' },
      { value: 1000, label: '1000克' },
      { value: 5000, label: '5000克' }
    ]
  },
  {
    address: 122, // 0x007b
    name: '4路校正',
    dataType: 'uint32',
    readOnly: false,
    registerCount: 2,
    description: '4路校正。',
    options: [
      { value: 0, label: '0克' },
      { value: 1000, label: '1000克' },
      { value: 5000, label: '5000克' }
    ]
  },
  {
    address: 124, // 0x007d
    name: '5路校正',
    dataType: 'uint32',
    readOnly: false,
    registerCount: 2,
    description: '5路校正。',
    options: [
      { value: 0, label: '0克' },
      { value: 1000, label: '1000克' },
      { value: 5000, label: '5000克' }
    ]
  },
  {
    address: 126, // 0x007f
    name: '6路校正',
    dataType: 'uint32',
    readOnly: false,
    registerCount: 2,
    description: '6路校正。',
    options: [
      { value: 0, label: '0克' },
      { value: 1000, label: '1000克' },
      { value: 5000, label: '5000克' }
    ]
  },
  {
    address: 128, // 0x0081
    name: '7路校正',
    dataType: 'uint32',
    readOnly: false,
    registerCount: 2,
    description: '7路校正。',
    options: [
      { value: 0, label: '0克' },
      { value: 1000, label: '1000克' },
      { value: 5000, label: '5000克' }
    ]
  },
  {
    address: 130, // 0x0082 (corrected from 0x0083 as 130 is 0x82)
    name: '8路校正',
    dataType: 'uint32',
    readOnly: false,
    registerCount: 2,
    description: '8路校正。',
    options: [
      { value: 0, label: '0克' },
      { value: 1000, label: '1000克' },
      { value: 5000, label: '5000克' }
    ]
  },
  {
    address: 132, // 0x0084
    name: '9路校正',
    dataType: 'uint32',
    readOnly: false,
    registerCount: 2,
    description: '9路校正。',
    options: [
      { value: 0, label: '0克' },
      { value: 1000, label: '1000克' },
      { value: 5000, label: '5000克' }
    ]
  },
  {
    address: 134, // 0x0086
    name: '10路校正',
    dataType: 'uint32',
    readOnly: false,
    registerCount: 2,
    description: '10路校正。',
    options: [
      { value: 0, label: '0克' },
      { value: 1000, label: '1000克' },
      { value: 5000, label: '5000克' }
    ]
  },
  {
    address: 136, // 0x0088
    name: '11路校正',
    dataType: 'uint32',
    readOnly: false,
    registerCount: 2,
    description: '11路校正。',
    options: [
      { value: 0, label: '0克' },
      { value: 1000, label: '1000克' },
      { value: 5000, label: '5000克' }
    ]
  },
  {
    address: 138, // 0x008a
    name: '12路校正',
    dataType: 'uint32',
    readOnly: false,
    registerCount: 2,
    description: '12路校正。',
    options: [
      { value: 0, label: '0克' },
      { value: 1000, label: '1000克' },
      { value: 5000, label: '5000克' }
    ]
  },
  {
    address: 140, // 0x008c
    name: '13路校正',
    dataType: 'uint32',
    readOnly: false,
    registerCount: 2,
    description: '13路校正。',
    options: [
      { value: 0, label: '0克' },
      { value: 1000, label: '1000克' },
      { value: 5000, label: '5000克' }
    ]
  },
  {
    address: 142, // 0x008e
    name: '14路校正',
    dataType: 'uint32',
    readOnly: false,
    registerCount: 2,
    description: '14路校正。',
    options: [
      { value: 0, label: '0克' },
      { value: 1000, label: '1000克' },
      { value: 5000, label: '5000克' }
    ]
  },
  {
    address: 144, // 0x0090
    name: '15路校正',
    dataType: 'uint32',
    readOnly: false,
    registerCount: 2,
    description: '15路校正。',
    options: [
      { value: 0, label: '0克' },
      { value: 1000, label: '1000克' },
      { value: 5000, label: '5000克' }
    ]
  },
  {
    address: 146, // 0x0092
    name: '16路校正',
    dataType: 'uint32',
    readOnly: false,
    registerCount: 2,
    description: '16路校正。',
    options: [
      { value: 0, label: '0克' },
      { value: 1000, label: '1000克' },
      { value: 5000, label: '5000克' }
    ]
  },
  {
    address: 148, // 0x0094
    name: 'AD采样速度',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: 'AD采样速度。范围: 10Hz ~ 1280Hz. (原默认: 10Hz)'
  },
  {
    address: 149, // 0x0095
    name: '单位切换',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: '单位切换。选项: 1=KG, 2=斤, 3=克, 4=其他单位.',
    options: [
      { label: 'KG', value: 1 },
      { label: '斤', value: 2 },
      { label: '克', value: 3 },
      { label: '其他单位', value: 4 }
    ]
  },
  {
    address: 150, // 0x0096
    name: '按键提示',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: '按键提示音。'
  },
  {
    address: 151, // 0x0097
    name: '恢复出厂',
    dataType: 'uint16',
    readOnly: false,
    registerCount: 1,
    description: '恢复出厂设置 (按钮)。写入特定值以触发。'
  }
]

console.log('weightDeviceConfig.length', weightDeviceConfig.length)

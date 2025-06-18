import { registerConfigs } from '../data'

const findAddress = (name: string) => {
  const configs = registerConfigs.filter((item) => item.name.endsWith(name))
  return configs.map((c) => c.address)
}

export const timeConfigAddressConfig = {
  timingEnable_1: findAddress('定时使能1'),
  timingEnable_2: findAddress('定时使能2'),
  timingEnable_3: findAddress('定时使能3'),
  timingEnable_4: findAddress('定时使能4'),
  timingEnable_1_range: [
    findAddress('开始小时1'), // 
    findAddress('开始分钟1'),
    findAddress('关闭小时1'),
    findAddress('关闭分钟1')
  ],
  timingEnable_2_range: [
    findAddress('开始小时2'),
    findAddress('开始分钟2'),
    findAddress('关闭小时2'),
    findAddress('关闭分钟2')
  ],
  timingEnable_3_range: [
    findAddress('开始小时3'),
    findAddress('开始分钟3'),
    findAddress('关闭小时3'),
    findAddress('关闭分钟3')
  ],
  timingEnable_4_range: [
    findAddress('开始小时4'),
    findAddress('开始分钟4'),
    findAddress('关闭小时4'),
    findAddress('关闭分钟4')
  ]
}

export const timeConfigArr = [
  {
    unAuthName: ['unAuth', 'timingEnable_1'],
    authName: ['auth', 'timingEnable_1'],
    relatedAddress: timeConfigAddressConfig.timingEnable_1,
    timeRelatedAddress: timeConfigAddressConfig.timingEnable_1_range,
    key: 'timingEnable_1',
    label: '定时使能 1',
    timeConfig: {
      name: ['auth', 'timingEnable_1_range'],
      unAuthName: ['unAuth', 'timingEnable_1_range'],
      label: '起止时间'
    }
  },
  {
    unAuthName: ['unAuth', 'timingEnable_2'],
    authName: ['auth', 'timingEnable_2'],
    key: 'timingEnable_2',
    timeRelatedAddress: timeConfigAddressConfig.timingEnable_2_range,
    relatedAddress: timeConfigAddressConfig.timingEnable_2,
    label: '定时使能 2',
    timeConfig: {
      name: ['auth', 'timingEnable_2_range'],
      unAuthName: ['unAuth', 'timingEnable_2_range'],
      label: '起止时间'
    }
  },
  {
    unAuthName: ['unAuth', 'timingEnable_3'],
    authName: ['auth', 'timingEnable_3'],
    key: 'timingEnable_3',
    relatedAddress: timeConfigAddressConfig.timingEnable_3,
    timeRelatedAddress: timeConfigAddressConfig.timingEnable_3_range,
    label: '定时使能 3',
    timeConfig: {
      name: ['auth', 'timingEnable_3_range'],
      unAuthName: ['unAuth', 'timingEnable_3_range'],
      label: '起止时间'
    }
  },
  {
    unAuthName: ['unAuth', 'timingEnable_4'],
    authName: ['auth', 'timingEnable_4'],
    key: 'timingEnable_4',
    relatedAddress: timeConfigAddressConfig.timingEnable_4,
    timeRelatedAddress: timeConfigAddressConfig.timingEnable_4_range,
    label: '定时使能 4',
    timeConfig: {
      name: ['auth', 'timingEnable_4_range'],
      unAuthName: ['unAuth', 'timingEnable_4_range'],
      label: '起止时间'
    }
  }
]

export const defaultSystemConfig: ISystemConfig = {
  maxOnlineTime: 180,
  screenSaver: 15,
  unAuth: {
    timingEnable_1: true,
    timingEnable_2: true,
    timingEnable_3: true,
    timingEnable_4: true,
    timingEnable_1_range: ['08:00', '20:00'],
    timingEnable_2_range: ['08:00', '20:00'],
    timingEnable_3_range: ['08:00', '20:00'],
    timingEnable_4_range: ['08:00', '20:00']
  },
  auth: {
    timingEnable_1: true,
    timingEnable_2: true,
    timingEnable_3: true,
    timingEnable_4: true,
    timingEnable_1_range: ['08:00', '20:00'],
    timingEnable_2_range: ['08:00', '20:00'],
    timingEnable_3_range: ['08:00', '20:00'],
    timingEnable_4_range: ['08:00', '20:00']
  }
}

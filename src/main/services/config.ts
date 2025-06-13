import { parseResponseWithContext } from '../utils/modbusUtils'
import Service from './service'

export const setLocalConfig = (key: keyof IConfig, value: IConfig[keyof IConfig]): IConfig => {
  const store = Service.getInstance().store
  let config = store.get('config') as IConfig
  if (!config) {
    config = {} as IConfig
  }
  config[key] = value
  store.set('config', config)
  return config
}

export const getLocalConfig = (): IConfig => {
  const store = Service.getInstance().store
  const config = store.get('config') as IConfig
  return config || {}
}

// 检查端口是否为舱门设备
// { address: 8, name: '满仓报警是否亮灯', dataType: 'bool', readOnly: false },
// { address: 9, name: '烟雾报警是否亮灯', dataType: 'bool', readOnly: false },
// { address: 10, name: '温度报警是否亮灯', dataType: 'bool', readOnly: false },
// { address: 11, name: '满仓是否语音播报', dataType: 'bool', readOnly: false },
export const checkPortIsPutterDevice = async (port: string) => {
  const client = Service.getInstance().modbusClient

  return new Promise((resolve) => {
    setTimeout(() => {
      Service.getInstance().store.set('weightDevicePort', port)
      resolve({ isPutterDevice: false })
    }, 2000)
    client
      .readRegisters({
        deviceAddress: 0x01,
        startAddress: 8,
        registerCount: 4,
        port
      })
      .then((result) => {
        const isPutterDevice = (result as number[]).every((item) => item === 0 || item === 1)
        Service.getInstance().store.set(
          isPutterDevice ? 'putterDevicePort' : 'weightDevicePort',
          port
        )
        resolve({ isPutterDevice })
      })
      .catch(() => {
        Service.getInstance().store.set('weightDevicePort', port)
        resolve({ isPutterDevice: false })
      })
  })
}

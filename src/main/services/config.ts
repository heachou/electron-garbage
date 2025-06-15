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

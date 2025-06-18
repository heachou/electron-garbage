import { defaultSystemConfig } from '../const/config'
import Service from './service'

export const setLocalConfig = (key: string | string[], value: unknown): ISystemConfig => {
  const store = Service.getInstance().store
  const keys = typeof key === 'string' ? key.split('.') : (key as string[])
  let config = store.get('config') as ISystemConfig
  if (!config) {
    config = {} as ISystemConfig
  }
  let temp = config

  while (keys.length) {
    const k = keys.shift()
    if (keys.length) {
      if (!temp[k]) {
        temp[k] = {}
      }
      temp = temp[k] as ISystemConfig
    } else {
      temp[k] = value
    }
  }

  console.log('🚀 ~ setLocalConfig ~ config:', config)

  store.set('config', config)
  return config
}

export const getLocalConfig = (): ISystemConfig => {
  const store = Service.getInstance().store
  const config = store.get('config') as ISystemConfig
  if (!config) {
    store.set('config', defaultSystemConfig)
    return defaultSystemConfig
  }
  return {
    ...defaultSystemConfig,
    ...config
  }
}

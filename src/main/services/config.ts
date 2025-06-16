import Service from './service'

const initialConfig: IConfig = {
  canPutWithoutAuth: true,
  maxOnlineTime: 180,
  screenSaver: 15
}

export const setLocalConfig = <K extends keyof IConfig>(key: K, value: IConfig[K]): IConfig => {
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
  if (!config) {
    store.set('config', initialConfig)
    return initialConfig
  }
  return {
    ...initialConfig,
    ...config
  }
}

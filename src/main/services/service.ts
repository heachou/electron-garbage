import { ModbusClient } from './../module/modbusClient'
import { BrowserWindow } from 'electron'
import Store from 'electron-store'
import UserService from './user'
import logger from 'electron-log'
import { SmallestUpdater } from 'electron-smallest-updater'

const baseURL = import.meta.env.VITE_SMALLEST_UPDATE_PATH

class Service {
  public mainWindow: BrowserWindow | null = null
  public modbusClient: ModbusClient = ModbusClient.getInstance()
  public store: Store = new Store()
  public user: UserService = new UserService()
  public smallestUpdater: SmallestUpdater = new SmallestUpdater({
    logger,
    publish: {
      url: `${baseURL}/smallest-updates`
    },
    autoDownload: false,
    forceDevUpdateConfig: true
  })

  private static instance: Service

  private constructor() {}

  public setInstance({ mainWindow }: { mainWindow: BrowserWindow | null }) {
    this.mainWindow = mainWindow
  }

  // 获取单例实例的静态方法
  public static getInstance(): Service {
    if (!Service.instance) {
      Service.instance = new Service()
    }
    return Service.instance
  }
}

export default Service

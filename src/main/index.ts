import { app, BrowserWindow, globalShortcut, ipcMain, screen } from 'electron'
import { join } from 'path'
import { createApplicationMenu } from './menu'
import createIpcHandlers from './services'
import Service from './services/service'
import { encodeError, setupSecurity } from './utils'
import { is } from '@electron-toolkit/utils'
import { addSmallestUpdaterListeners, addUpdaterListener, checkSmallUpdate } from './module/updater'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.bounds
  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width,
    height,
    frame: false,
    titleBarStyle: 'hidden',
    alwaysOnTop: true,
    kiosk: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js')
    }
  })
  // 创建并设置应用程序菜单
  createApplicationMenu(mainWindow)

  // 保存 mainWindow 实例
  Service.getInstance().setInstance({ mainWindow })
  // 注册 IPC 处理程序
  Object.entries(createIpcHandlers()).forEach(([channel, handler]) => {
    ipcMain.handle(channel, async (_, ...args) => {
      try {
        return {
          // @ts-expect-error 类型问题
          result: await handler(...args)
        }
      } catch (error) {
        return {
          error: encodeError(error as Error, channel)
        }
      }
    })
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  setupSecurity()

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    mainWindow?.setAlwaysOnTop(true, 'screen-saver')
    mainWindow?.maximize()
    // 检查全量更新
    addUpdaterListener()
    addSmallestUpdaterListeners()
    // 检查增量更新,每小时一次
    checkSmallUpdate()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    globalShortcut.unregisterAll()
    Service.getInstance().setInstance({ mainWindow: null })
  })
  // 禁止缩放
  mainWindow.webContents.setVisualZoomLevelLimits(1, 1)
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // 当运行第二个实例时,将会聚焦到 mainWindow 这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.on('ready', () => {
    createWindow()
    if (!is.dev) {
      const settings = app.getLoginItemSettings()
      if (!settings.openAtLogin) {
        app.setLoginItemSettings({
          openAtLogin: true
        })
      }
    }
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    globalShortcut.unregisterAll()
    app.quit()
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

process.on('message', (msg) => {
  if (msg === 'electron-vite&type=hot-reload') {
    for (const win of BrowserWindow.getAllWindows()) {
      win.webContents.reload()
    }
  }
})

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  event.preventDefault()
  callback(true) // 强制接受证书
})

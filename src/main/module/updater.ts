import { app, dialog } from 'electron'
import logger from 'electron-log'
import ProgressBar from 'electron-progressbar'
import { SmallestUpdater } from 'electron-smallest-updater'
import { autoUpdater } from 'electron-updater'
import Service from '../services/service'

const baseURL = import.meta.env.VITE_SMALLEST_UPDATE_PATH

function addSmallestUpdaterListeners(): SmallestUpdater {
  // 创建实例
  const smallestUpdater = new SmallestUpdater({
    logger,
    publish: {
      url: `${baseURL}/smallest-updates`
    },
    autoDownload: false,
    forceDevUpdateConfig: true
  })

  // 更新可用
  smallestUpdater.on('update-available', (info) => {
    console.log('[electron-updater]', '更新可用', info)
    smallestUpdater.downloadUpdate() // 手动下载更新
  })

  // 更新不可用
  smallestUpdater.on('update-not-available', () => {})

  // 下载进度
  smallestUpdater.on('download-progress', (progress) => {
    console.log('[electron-updater]', '下载进度', progress)
  })

  // 下载完成
  smallestUpdater.on('update-downloaded', (info) => {
    console.log('[electron-updater]', '下载完成', info)
    smallestUpdater.quitAndInstall() // 退出并安装重启
  })
  return smallestUpdater
}

export function initSmallestUpdater(): void {
  const smallestUpdater = addSmallestUpdaterListeners()
  // 定时检查更新，每小时一次
  setInterval(
    () => {
      smallestUpdater.checkForUpdates()
    },
    60 * 60 * 1000
  )
  // 立即执行一次
  smallestUpdater.checkForUpdates()
}

export function addUpdaterListener() {
  const mainWindow = Service.getInstance().mainWindow!
  autoUpdater.logger = logger

  // 默认会自动下载，如果不想自动下载，设置 autoUpdater.autoDownload = false
  autoUpdater.autoDownload = false

  // 开启开发环境测试自动更新程序流程，创建 dev-app-update.yml
  autoUpdater.forceDevUpdateConfig = true

  // 下载进度条
  const progressBar = new ProgressBar({
    title: '更新',
    text: '下载更新',
    detail: '等待下载',
    indeterminate: false,
    closeOnComplete: true,
    browserWindow: {
      show: false,
      modal: true,
      parent: mainWindow
    }
  })
  progressBar._window.hide()
  progressBar._window.setProgressBar(-1)

  // 更新可用
  autoUpdater.on('update-available', (info) => {
    console.log('[electron-updater]', '更新可用', info)
    const version = info.version
    const releaseNotes = info.releaseNotes || ''
    dialog
      .showMessageBox(mainWindow, {
        title: '版本更新',
        message: `发现新版本 ${version}，是否更新\n\n${releaseNotes}`,
        type: 'info',
        buttons: ['稍后更新', '立即更新']
      })
      .then(({ response }) => {
        if (response === 1) {
          progressBar._window.show()
          progressBar._window.setProgressBar(0)
          autoUpdater.downloadUpdate() // 手动下载更新
        }
      })
  })

  // 更新不可用
  autoUpdater.on('update-not-available', () => {
    progressBar.close()
    dialog.showMessageBox(mainWindow, {
      title: '版本更新',
      message: '当前已是最新版本',
      type: 'info',
      buttons: ['确定']
    })
  })

  // 下载进度
  autoUpdater.on('download-progress', (progress) => {
    console.log('[electron-updater]', '下载进度', progress)
    progressBar.value = progress.percent
    progressBar.detail = `下载中 ${(progress.transferred / 1000 / 1000).toFixed(2)}/${(progress.total / 1000 / 1000).toFixed(2)}`
  })
  // 下载完成
  autoUpdater.on('update-downloaded', (info) => {
    console.log('[electron-updater]', '下载完成', info)
    dialog
      .showMessageBox(mainWindow, {
        title: '下载完成',
        message: `重启可应用新版本`,
        type: 'info',
        buttons: ['稍后重启', '立即重启']
      })
      .then(({ response }) => {
        if (response === 1) {
          autoUpdater.quitAndInstall(false, true) // 退出并安装重启
        }
      })
  })
}

export async function checkAppUpdate() {
  const res = await autoUpdater.checkForUpdates()
  const latestVersion = res?.updateInfo?.version
  return {
    hasUpdate: res?.updateInfo.version !== app.getVersion(),
    newVersion: latestVersion,
    currentVersion: autoUpdater.currentVersion.version
  }
}

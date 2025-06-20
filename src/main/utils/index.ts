import { globalShortcut } from 'electron'
import { sendMessageToWindow } from '../services'

export const encodeError = (e: Error, channel: string) => {
  return { name: e.name, message: e.message, extra: { ...e, channel } }
}

export const showErrorMessage = (msg: string) => {
  sendMessageToWindow('showErrorMessage', msg)
}

export function setupSecurity() {
  // 拦截系统快捷键 - 使用正确的快捷键格式
  const blockShortcuts = [
    'CommandOrControl+Alt+Delete',
    'Alt+F4',
    'CommandOrControl+W',
    'Alt+Tab',
    'Command+Tab', // macOS 应用切换
    'Super+L', // Windows 锁屏
    'Command+Option+Esc' // macOS 强制退出
  ]

  // 添加平台特定的快捷键
  if (process.platform === 'win32') {
    blockShortcuts.push(
      'Ctrl+Esc', // 开始菜单
      'Win' // Windows 键
    )
  } else if (process.platform === 'darwin') {
    blockShortcuts.push(
      'Control+Command+Q' // macOS 锁屏
    )
  }

  blockShortcuts.forEach((shortcut) => {
    try {
      const ret = globalShortcut.register(shortcut, () => {
        console.log(`Blocked shortcut: ${shortcut}`)
        return false
      })

      if (!ret) {
        console.warn(`Shortcut registration failed: ${shortcut}`)
      }
    } catch (error) {
      console.error(`Error registering shortcut ${shortcut}:`, error)
    }
  })
}

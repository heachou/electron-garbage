import { globalShortcut } from 'electron'
import { sendMessageToWindow } from '../services'

export const encodeError = (e: Error, channel: string) => {
  return { name: e.name, message: e.message, extra: { ...e, channel } }
}

export const showErrorMessage = (msg: string) => {
  sendMessageToWindow('showErrorMessage', msg)
}

export function setupSecurity() {
  // 拦截系统快捷键
  const blockShortcuts = [
    'CommandOrControl+Alt+Delete',
    'Alt+F4',
    'CommandOrControl+W',
    'Alt+Tab',
    'Super', // Windows键
    'Super+L', // Windows锁屏
    'Command+Option+Esc' // Mac强制退出
  ]

  blockShortcuts.forEach((shortcut) => {
    globalShortcut.register(shortcut, () => {
      console.log(`Blocked: ${shortcut}`)
      return false
    })
  })
}

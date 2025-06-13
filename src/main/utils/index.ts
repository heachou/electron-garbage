import { sendMessageToWindow } from '../services'

export const encodeError = (e: Error, channel: string) => {
  return { name: e.name, message: e.message, extra: { ...e, channel } }
}

export const showErrorMessage = (msg: string) => {
  sendMessageToWindow('showErrorMessage', msg)
}

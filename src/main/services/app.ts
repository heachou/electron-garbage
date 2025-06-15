import { machineId } from 'node-machine-id'
import request from '../utils/request'
import FormData from 'form-data'
import Service from './service'
import { sendMessageToWindow } from '.'
import { app } from 'electron'
import { listDevices } from './weight'

/**
 * 获取设备唯一标识
 * @returns
 */
export const getAppId = async () => {
  return await machineId(true)
}
// qr-code 身份码
// card-no: 卡号
// scan-qr-code: 扫码登录
// face: 人脸识别
type LoginType = 'qr-code' | 'card-no' | 'scan-qr-code' | 'face' | 'phone'

export const appLogin = async ({
  type,
  code,
  phone
}: {
  type: LoginType
  code?: string
  phone?: string
}): Promise<UserInfo | IScanQrCodeUserInfoRes> => {
  const deviceCode = await getAppId()
  const res = await request.post(
    '/mini/app/login',
    { type, code, deviceCode, phone },
    { skipNotification: true }
  )
  const user = type === 'scan-qr-code' ? res.data.user : res.data
  if (user) {
    Service.getInstance().user.deleteToken()
    Service.getInstance().user.deleteUserInfo()
    Service.getInstance().user.saveUserInfo(user)
    Service.getInstance().user.saveToken(user.token)
    sendMessageToWindow('userLoginSuccess', user)
  }
  if (type === 'scan-qr-code') {
    return res.data as IScanQrCodeUserInfoRes
  }
  return res.data
}

/**
 * 获取登录小程序码
 * @returns
 */
export const getLoginQrCode = async (): Promise<{ qrCode: string; key: string }> => {
  const res = await request.get('/mini/app/mini/code')
  return res.data
}

/**
 * 获取二维码
 * @param formData
 * @returns
 */
export const getErWeiQrCode = async (): Promise<{ qrCode: string; key: string }> => {
  const res = await request.get('/mini/app/qr-code')
  return res.data
}

export const fileUpload = async (formData: FormData): Promise<IUploadFileRes> => {
  const res = (await request.post('/mini/api/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })) as IUploadFileRes
  return res
}

export const faceLogin = async ({
  arrayBuffer,
  filename,
  contentType
}: IFaceCheckReq): Promise<UserInfo> => {
  const form = new FormData()
  const buffer = Buffer.from(arrayBuffer)
  form.append('file', buffer, {
    filename,
    contentType
  })
  try {
    const { fileName } = await fileUpload(form)
    const loginRes = await appLogin({ type: 'face', code: fileName })
    return loginRes as UserInfo
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * 发送手机验证码
 * @param phone
 * @returns
 */
export const sendPhoneCode = async (phone: string): Promise<{ code: string }> => {
  const res = await request.post('/mini/send/phone/code', { phone })
  return res.data
}

export const phoneLogin = async ({ phone }: { phone: string }): Promise<UserInfo> => {
  const res = await appLogin({ type: 'phone', phone })
  return res as UserInfo
}

/**
 * 绑定人脸
 * @param param0
 * @returns
 */
export const bindFace = async ({
  arrayBuffer,
  filename,
  contentType
}: IFaceCheckReq): Promise<boolean> => {
  const form = new FormData()
  const buffer = Buffer.from(arrayBuffer)
  form.append('file', buffer, {
    filename,
    contentType
  })
  const { fileName } = await fileUpload(form)
  await request.post('/mini/api/user/bind/face', { faces: [fileName] }, { skipNotification: true })
  return true
}
/**
 * 绑定卡号
 * @param param0
 * @returns
 */
export const bindCard = async ({ cardNo }: { cardNo: string }): Promise<{ code: string }> => {
  const res = await request.post('/mini/api/user/bind/card_no', { cardNo })
  return res.data
}

/**
 * 用户退出登录
 */
export const handleUserLogout = async () => {
  Service.getInstance().user.logout()
}

/**
 * 断开设备
 * @returns
 */
export const closeDevice = async ({ path }: { path: string }) => {
  const client = Service.getInstance().modbusClient
  client.closePort(path)
  const isPutter = path === Service.getInstance().store.get('putterDevicePort')
  if (isPutter) {
    Service.getInstance().store.delete('putterDevicePort')
  } else {
    Service.getInstance().store.delete('weightDevicePort')
  }
}

/**
 * 自动连接设备
 */
export const autoConnectDevice = async () => {
  const putterDevicePort = Service.getInstance().store.get('putterDevicePort') as string
  const weightDevicePort = Service.getInstance().store.get('weightDevicePort') as string
  const devices = await listDevices()
  console.log('🚀 ~ autoConnectDevice ~ putterDevicePort:', putterDevicePort)
  console.log('🚀 ~ autoConnectDevice ~ weightDevicePort:', weightDevicePort)
  console.log('🚀 ~ autoConnectDevice ~ i:', devices)
  if (putterDevicePort && devices.some((device) => device.path === putterDevicePort)) {
    await openDevice({ path: putterDevicePort, deviceType: 'putter' })
  }
  if (weightDevicePort && devices.some((device) => device.path === weightDevicePort)) {
    await openDevice({ path: weightDevicePort, deviceType: 'weight' })
  }
}

/**
 * 打开设备
 * @returns
 */
export const openDevice = async ({
  path,
  deviceType
}: {
  path: string
  deviceType: 'putter' | 'weight'
}) => {
  const client = Service.getInstance().modbusClient
  await client.openPort(path)
  Service.getInstance().store.set(
    deviceType === 'putter' ? 'putterDevicePort' : 'weightDevicePort',
    path
  )
}

export const closeAllDevice = async () => {
  const client = Service.getInstance().modbusClient
  const putterDevicePort = Service.getInstance().store.get('putterDevicePort') as string
  const weightDevicePort = Service.getInstance().store.get('weightDevicePort') as string
  if (putterDevicePort) {
    client.closePort(putterDevicePort)
  }
  if (weightDevicePort) {
    client.closePort(weightDevicePort)
  }
  Service.getInstance().store.delete('putterDevicePort')
  Service.getInstance().store.delete('weightDevicePort')
}

export const getUserInfo = async (): Promise<Omit<UserInfo, 'token'>> => {
  const res = await request.post('/mini/api/user/info')
  console.log('🚀 ~ getUserInfo ~ res:', res)
  return res.data
}

/**
 * 管理员登录
 * @param username
 * @param password
 * @returns
 */
export const adminLogin = async ({
  username,
  password
}: {
  username: string
  password: string
}): Promise<UserInfo> => {
  const res = await request.post('/login', { username, password })
  return res.data
}

/**
 * 关闭应用
 */
export const closeApp = () => {
  app.quit()
}

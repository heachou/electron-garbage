import WebSocket from 'ws'
import { app } from 'electron'
import { sendMessageToWindow } from '../services'
import RPCClient from '@alicloud/pop-core'
import Service from '../services/service'
import { v4 as uuidv4 } from 'uuid'

const ws: WebSocket | null = null

interface IRpcTokenResult {
  Token: {
    Id: string
    UserId: string
    ExpireTime: number
  }
}

const WS_TOKEN_KEY = 'WS_TOKEN_KEY'

export const getWsToken = async () => {
  const store = Service.getInstance().store
  const token = store.get(WS_TOKEN_KEY) as IRpcTokenResult['Token']
  if (token && token.Id && token.ExpireTime * 1000 > Date.now()) {
    return token.Id
  }
  const client = new RPCClient({
    accessKeyId: import.meta.env.VITE_ALIYUN_AK_ID,
    accessKeySecret: import.meta.env.VITE_ALIYUN_AK_SECRET,
    endpoint: 'http://nls-meta.cn-shanghai.aliyuncs.com',
    apiVersion: '2019-02-28'
  })
  const result: IRpcTokenResult = await client.request('CreateToken', {})
  store.set(WS_TOKEN_KEY, result.Token)
  return result.Token.Id
}

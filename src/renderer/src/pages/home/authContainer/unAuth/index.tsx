import { callApi } from '@renderer/utils'
import { useRequest } from 'ahooks'
import { Button, Divider, message, Spin } from 'antd'
import { useCallback, useState } from 'react'
import dayjs from 'dayjs'
import useUserStore from '@renderer/store/userStore'
import FaceVideoModal from './faceVideoModal'
import PhoneLoginContainer from './phoneLoginContainer'
import useBarcodeScanner from '@renderer/hooks/useBarcodeScanner'

const UnAuth = () => {
  const [cameraOpen, setCameraOpen] = useState(false)

  const updateUserInfo = useUserStore((state) => state.updateUserInfo)
  const [messageApi, messageContext] = message.useMessage()

  const {
    data,
    loading,
    refresh: refreshLoginQrCode
  } = useRequest(
    async () => {
      return callApi('getLoginQrCode')
    },
    {
      retryCount: 3,
      onSuccess: () => {
        startGetScanQrCodeResult()
      }
    }
  )

  const { data: erWeiCode, refresh: refreshErWeiQrCode } = useRequest(
    async () => {
      return callApi('getErWeiQrCode')
    },
    {
      retryCount: 3,
      onSuccess: () => {
        startGetErWeiQrCodeResult()
      }
    }
  )

  // 轮询二维码扫码登录结果
  const { run: startGetErWeiQrCodeResult, cancel: cancelPollingErWeiCodeResult } = useRequest(
    async () => {
      if (!erWeiCode?.key) return Promise.reject()
      return callApi('appLogin', {
        type: 'scan-qr-code',
        code: erWeiCode?.key || ''
      }) as unknown as Promise<IScanQrCodeUserInfoRes>
    },
    {
      pollingInterval: 2000,
      manual: true,
      onSuccess: (res) => {
        const { expire, user } = res
        const isExpire = dayjs(expire).isBefore(dayjs().valueOf(), 'second')
        if (isExpire) {
          refreshErWeiQrCode()
        }
        if (user?.token) {
          updateUserInfo(user)
          cancelPollingErWeiCodeResult()
        }
      },
      onError: (err) => {
        // @ts-expect-error TODO
        const msg = err?.extra?.msg
        if (msg === 'code无效') {
          refreshErWeiQrCode()
          return
        }
        if (msg) {
          messageApi.error(msg)
        }
      }
    }
  )
  // 轮询小程序扫码登录结果
  const { run: startGetScanQrCodeResult, cancel: cancelPollingScanQrCodeResult } = useRequest(
    async () => {
      if (!data?.key) return Promise.reject()
      return callApi('appLogin', {
        type: 'scan-qr-code',
        code: data?.key || ''
      }) as unknown as Promise<IScanQrCodeUserInfoRes>
    },
    {
      pollingInterval: 2000,
      manual: true,
      onSuccess: (res) => {
        const { expire, user } = res
        const isExpire = dayjs(expire).isBefore(dayjs().valueOf(), 'second')
        if (isExpire) {
          refreshLoginQrCode()
        }
        if (user?.token) {
          updateUserInfo(user)
          cancelPollingScanQrCodeResult()
        }
      },
      onError: (err) => {
        // @ts-expect-error TODO
        const msg = err?.extra?.msg
        if (msg === 'code无效') {
          refreshLoginQrCode()
          return
        }
        if (msg) {
          messageApi.error(msg)
        }
      }
    }
  )

  const { run: handleBarcodeScan } = useRequest(
    async (code) => {
      if (!code) return Promise.reject()
      const isFromWeChat = code.startsWith('qr_code:')
      return callApi('appLogin', {
        type: isFromWeChat ? 'qr-code' : 'card-no',
        code
      }) as unknown as Promise<UserInfo>
    },
    {
      manual: true,
      onSuccess: (user) => {
        if (user?.token) {
          updateUserInfo(user)
        }
        messageApi.success('登录成功！')
      },
      onError: () => {
        messageApi.error('登录失败！')
      }
    }
  )

  useBarcodeScanner({
    onScan: handleBarcodeScan,
    preventInput: true
  })

  const handleStartFaceLogin = useCallback(() => {
    setCameraOpen(true)
    cancelPollingScanQrCodeResult()
    cancelPollingErWeiCodeResult()
  }, [cancelPollingErWeiCodeResult, cancelPollingScanQrCodeResult])

  const handleCloseFaceLogin = useCallback(
    ({ loginSuccess }: { loginSuccess: boolean }) => {
      setCameraOpen(false)
      if (!loginSuccess) {
        startGetScanQrCodeResult()
        startGetErWeiQrCodeResult()
      }
    },
    [startGetErWeiQrCodeResult, startGetScanQrCodeResult]
  )

  return (
    <>
      <div className="flex flex-1 flex-col h-full min-h-0 justify-between">
        <h1 className="text-4xl mb-12 font-bold"> 登录 </h1>
        <div className="flex flex-col flex-1 w-full">
          <PhoneLoginContainer />
          <Button
            onClick={handleStartFaceLogin}
            size="large"
            className="text-xl mt-6  h-[60px] text-white bg-primary"
          >
            人脸识别登录
          </Button>
        </div>
        <Spin spinning={loading}>
          <div className="grid grid-cols-2 mt-20 gap-x-8">
            <div className="flex flex-col items-center space-y-2 text-center border border-solid border-gray-100 rounded-md py-10">
              {data?.qrCode && (
                <img src={`data:image/png;base64,${data?.qrCode}`} alt="" className="w-40" />
              )}
              <p className="mb-0 text-xs">微信扫一扫进入小程序</p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center border border-solid border-gray-100 rounded-md py-10">
              {erWeiCode?.qrCode && (
                <img src={`data:image/png;base64,${erWeiCode?.qrCode}`} alt="" className="w-40" />
              )}
              <p className="mb-0 text-xs">微信扫一扫投递垃圾</p>
            </div>
          </div>
        </Spin>
      </div>
      {cameraOpen && <FaceVideoModal open={cameraOpen} onClose={handleCloseFaceLogin} />}
      {messageContext}
    </>
  )
}

export default UnAuth

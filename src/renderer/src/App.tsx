import React from 'react'
import { useEffect } from 'react'
import { Alert, Button, message } from 'antd'
import useLocalConfigStore from './store/localStore'
import { useMount } from 'ahooks'
import { usePutterState } from './hooks/usePutterState'
import { useWeightDevice } from './hooks/useWeightDevice'
import useListener from './hooks/useListener'

function App({ children }: { children: React.ReactNode }) {
  const getConfig = useLocalConfigStore((state) => state.getConfig)
  const config = useLocalConfigStore((state) => state.config)

  useMount(() => {
    getConfig()
  })

  const {
    startPutterDeviceEnable,
    startPollingPutterState,
    opened,
    connect: connectPutterDevice
  } = usePutterState()
  const {
    startPollingWeightDevice,
    opened: weightDeviceOpened,
    getAllWeightState
  } = useWeightDevice()

  useEffect(() => {
    if (opened) {
      startPollingPutterState()
    }
  }, [connectPutterDevice, opened, startPollingPutterState])

  useEffect(() => {
    if (weightDeviceOpened) {
      startPollingWeightDevice().then(() => {
        getAllWeightState()
      })
    }
  }, [getAllWeightState, startPollingWeightDevice, weightDeviceOpened])

  useListener('userLoginSuccess', () => {
    if (opened) {
      // 用户登录成功，开启所有的定时使能选项
      startPutterDeviceEnable(true)
    }
    // 获取一次重量
    if (weightDeviceOpened) {
      startPollingWeightDevice()
    }
  })

  useListener('sessionExpired', () => {
    // 用户退出登录
    if (opened) {
      startPutterDeviceEnable(!!config?.canPutWithoutAuth)
    }
    if (weightDeviceOpened) {
      // 获取一次重量
      startPollingWeightDevice()
    }
  })

  useEffect(() => {
    if (!config) {
      return
    }
    if (!opened) {
      return
    }
    // 如果可以不登录直接投递
    if (config?.canPutWithoutAuth) {
      startPutterDeviceEnable(true)
    } else {
      // 否则，关闭所有的定时使能选项
      startPutterDeviceEnable(false)
    }
  }, [config, config?.canPutWithoutAuth, opened])

  const [messageApi, messgeContext] = message.useMessage()
  useListener('showErrorMessage', (msg) => {
    messageApi.error(msg)
  })

  return (
    <>
      {messgeContext}
      {(!opened || !weightDeviceOpened) && (
        <div className="absolute top-2 left-2 z-10">
          {!opened && <Alert message="推杆设备未连接" type="error" />}
          {!weightDeviceOpened && <Alert message="重量秤设备未连接" type="error" />}
        </div>
      )}
      {children}
    </>
  )
}

export default App

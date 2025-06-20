import React from 'react'
import { useEffect } from 'react'
import { Alert, message } from 'antd'
import useLocalConfigStore from './store/localStore'
import { useMount, useRequest } from 'ahooks'
import { usePutterState } from './hooks/usePutterState'
import { useWeightDevice } from './hooks/useWeightDevice'
import useListener from './hooks/useListener'
import { callApi } from './utils'
import usePuttingEquipmentStore from './store/puttingEquipmentStore'
import useWeightDeviceStore from './store/weightDeviceStore'
import useGarbageKindStore from './store/garbageStore'
import useTimeEnableConfigSync from './hooks/useTimeEnableConfigSync'

function App({ children }: { children: React.ReactNode }) {
  const getConfig = useLocalConfigStore((state) => state.getConfig)

  useMount(() => {
    getConfig()
  })

  const setPutterDeviceOpened = usePuttingEquipmentStore((state) => state.getOpened)
  const setWeightDeviceOpened = useWeightDeviceStore((state) => state.getOpened)
  useMount(async () => {
    await callApi('autoConnectDevice')
    await setPutterDeviceOpened()
    await setWeightDeviceOpened()
  })

  const fetchGarbageKindList = useGarbageKindStore((state) => state.fetchGarbageKindList)

  useRequest(
    async () => {
      return fetchGarbageKindList()
    },
    {
      pollingInterval: 60 * 1000 * 60
    }
  )

  const { startPollingPutterState, opened } = usePutterState()
  const {
    startPollingWeightDevice,
    opened: weightDeviceOpened,
    getAllWeightState
  } = useWeightDevice()

  useEffect(() => {
    if (weightDeviceOpened) {
      startPollingWeightDevice().then(() => {
        getAllWeightState()
      })
    }
  }, [getAllWeightState, startPollingWeightDevice, weightDeviceOpened])

  useListener('userLoginSuccess', () => {
    // 获取一次重量
    if (weightDeviceOpened) {
      startPollingWeightDevice()
    }
  })

  useListener('sessionExpired', () => {
    if (weightDeviceOpened) {
      // 获取一次重量
      startPollingWeightDevice()
    }
  })
  // 定时使能配置同步
  useTimeEnableConfigSync({
    onSuccess: async () => {
      await startPollingPutterState()
    }
  })

  // 时间同步
  const { runAsync: syncTime } = useRequest(
    async () => {
      return callApi('syncCurrentTime')
    },
    {
      manual: true,
      pollingInterval: 3 * 60 * 60 * 1000
    }
  )

  useEffect(() => {
    if (opened) {
      setTimeout(async () => {
        await startPollingPutterState()
        await syncTime()
      }, 1000)
    }
  }, [opened, startPollingPutterState, syncTime])

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

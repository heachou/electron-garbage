import { useRequest } from 'ahooks'
import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import useWeightDeviceStore from '@renderer/store/weightDeviceStore'
import { callApi, createFixedLengthArray } from '@renderer/utils'

export const useWeightDevice = () => {
  const {
    opened,
    getOpened,
    openWeightDevicePort,
    updateWeightDeviceState,
    updateWeightConfigState
  } = useWeightDeviceStore(
    useShallow((state) => {
      // 添加 setRegisters
      return {
        openWeightDevicePort: state.openWeightDevicePort,
        opened: state.opened,
        getOpened: state.getOpened,
        updateWeightConfigState: state.updateWeightConfigState,
        updateWeightDeviceState: state.updateWeightDeviceState // 获取更新状态的方法
      }
    })
  )

  const connect = useCallback(async () => {
    const isOpen = await getOpened()
    if (isOpen) return
    await openWeightDevicePort()
  }, [getOpened, openWeightDevicePort])
  // 获取重量
  const getState = useCallback(async () => {
    const res = await callApi('readWeightMultipleRegisters', { startAddress: 0, registerCount: 24 })
    return res
  }, [])

  // 获取状态, 每20秒执行一次
  const { runAsync: startPollingWeightDevice, refresh: refreshWeightState } = useRequest(getState, {
    ready: opened,
    pollingInterval: 20 * 1000,
    manual: true,
    async onSuccess(res) {
      updateWeightDeviceState(res)
      // 超过 500 kg
      const isOverMaxWeight = res.slice(0, 6).some((item) => item > 1000 * 500)
      if (!isOverMaxWeight) {
        // 重量上传
        await callApi('uploadPutInWeight', createFixedLengthArray(res.slice(0, 6), 12))
      }
    }
  })

  const { runAsync: getAllWeightState } = useRequest(
    async () => {
      return callApi('getAllWeightData')
    },
    {
      manual: true,
      onSuccess(res) {
        const config = res.reduce((result, current) => {
          result[current.name] = current
          return result
        }, {})
        console.log('🚀 ~ config ~ config:', config)
        updateWeightConfigState(config)
      }
    }
  )

  return {
    opened,
    connect,
    startPollingWeightDevice,
    refreshWeightState,
    getAllWeightState
  }
}

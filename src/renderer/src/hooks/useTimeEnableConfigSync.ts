import useUserStore from '@renderer/store/userStore'
import useLocalConfigStore from '@renderer/store/localStore'
import { useCallback, useMemo } from 'react'
import usePuttingEquipmentStore from '@renderer/store/puttingEquipmentStore'
import { useRequest } from 'ahooks'
import { timeConfigAddressConfig } from '@/main/const/config'
import dayjs from 'dayjs'
import { callApi } from '@renderer/utils'

const useTimeEnableConfigSync = () => {
  const config = useLocalConfigStore((state) => state.config)
  const user = useUserStore((state) => state.userInfo)
  const putterDeviceOpended = usePuttingEquipmentStore((state) => state.opened)

  const finalConfig = useMemo(() => {
    if (!user) {
      return config?.unAuth
    }
    return config?.auth
  }, [config, user])

  const syncTimeEnableConfig = useCallback(async (config: ITimeEnableConfig) => {
    const keys = Object.keys(config)
    const promises: { address: number; value: number }[] = []
    for (const key of keys) {
      const addressList = timeConfigAddressConfig[key as keyof typeof timeConfigAddressConfig]
      const value = config[key]
      // 处理定时使能
      if (typeof value === 'boolean') {
        addressList.forEach((address) => {
          if (typeof address === 'number') {
            promises.push({
              address,
              value: value ? 1 : 0
            })
          }
        })
      }
      // 处理时间设置
      if (Array.isArray(value)) {
        const [startHour, startMinute] = [
          dayjs(value[0], 'HH:mm').hour(),
          dayjs(value[0], 'HH:mm').minute()
        ]
        const [endHour, endMinute] = [
          dayjs(value[1], 'HH:mm').hour(),
          dayjs(value[1], 'HH:mm').minute()
        ]
        const time = [startHour, startMinute, endHour, endMinute]
        addressList.forEach((address, index) => {
          if (Array.isArray(address)) {
            const [addr1, addr2, addr3, addr4] = address
            promises.push({
              address: addr1,
              value: time[index]
            })
            promises.push({
              address: addr2,
              value: time[index]
            })
            promises.push({
              address: addr3,
              value: time[index]
            })
            promises.push({
              address: addr4,
              value: time[index]
            })
          }
        })
      }
    }
    for (const param of promises) {
      try {
        await callApi('writeSingleRegisters', {
          startAddress: param.address,
          value: param.value
        })
      } catch (error) {
        console.log(error)
      }
    }
  }, [])

  useRequest(
    async () => {
      if (!putterDeviceOpended) {
        return
      }
      if (!finalConfig) {
        return
      }
      // 执行同步
      await syncTimeEnableConfig(finalConfig)
    },
    {
      ready: putterDeviceOpended,
      refreshDeps: [finalConfig]
    }
  )

  // 时间同步
  // useRequest(
  //   async () => {
  //     return callApi(')
  //   },
  //   {
  //     ready: putterDeviceOpended
  //   }
  // )
}

export default useTimeEnableConfigSync

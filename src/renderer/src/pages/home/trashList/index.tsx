import { useCallback, useMemo, useState } from 'react'
import { Card, Tag, Space, Button, message } from 'antd'
import useUserStore from '@renderer/store/userStore'
import {
  callApi,
  convertToKg,
  generateDoorTimeConfigForAllDoors,
  isTimeInRange,
  numberToChinese,
  sleep
} from '@renderer/utils'
import usePuttingEquipmentStore from '@renderer/store/puttingEquipmentStore'
import useWeightDeviceStore from '@renderer/store/weightDeviceStore'
import dayjs from 'dayjs'
import DoorOpenStatusModal from './doorOpenStatusModal'
import { useRequest } from 'ahooks'
import useLocalConfigStore from '@renderer/store/localStore'
import { useAutoCloseModal } from '@renderer/hooks/useAutoCloseModal'
import useDeliveryAction from '@renderer/hooks/useDeliveryAction'
import { usePutterState } from '@renderer/hooks/usePutterState'
import ChineseNumberSpeaker from '@renderer/components/chineseNumberSpeaker'
import RealTimeSpeechRecognition from '@renderer/components/RealTimeSpeechRecognition'

// 定义垃圾箱状态类型
type TrashStatus = 'normal' | 'fault'

// 定义垃圾箱数据接口
interface TrashBin {
  name?: string
  weight: number // 单位：千克
  status: TrashStatus
  startAddress: number
  doorKey: 'door1' | 'door2' | 'door3' | 'door4'
}

const TrashList = () => {
  const loginUser = useUserStore((state) => state.userInfo)

  const putterState = usePuttingEquipmentStore((state) => state.putterState)
  const weightState = useWeightDeviceStore((state) => state.weightState)
  const getScoreData = useUserStore((state) => state.getScoreData)

  const openDoorTimeConfig = useMemo(() => {
    return generateDoorTimeConfigForAllDoors(putterState)
  }, [putterState])

  const { data: bucketInfo } = useRequest(async () => callApi('getBucketInfo'), {
    cacheKey: 'getBucketInfo'
  })

  const trashBins: TrashBin[] = useMemo(() => {
    const { deviceBucketList } = bucketInfo || {}
    return [
      {
        name: deviceBucketList?.[0].category,
        weight: convertToKg(weightState?.one),
        status: putterState?.门1满仓报警?.value ? 'fault' : 'normal',
        startAddress: 30,
        doorKey: 'door1',
        bucket: deviceBucketList?.[0].bucket
      },
      {
        name: deviceBucketList?.[1].category,
        weight: convertToKg(weightState?.two),
        status: putterState?.门2满仓报警?.value ? 'fault' : 'normal',
        startAddress: 52,
        doorKey: 'door2',
        bucket: deviceBucketList?.[1].bucket
      },
      {
        name: deviceBucketList?.[2].category,
        weight: convertToKg(weightState?.three),
        status: putterState?.门3满仓报警?.value ? 'fault' : 'normal',
        startAddress: 74,
        doorKey: 'door3',
        bucket: deviceBucketList?.[2].bucket
      },
      {
        name: deviceBucketList?.[3].category,
        weight: convertToKg(weightState?.four),
        status: putterState?.门4满仓报警?.value ? 'fault' : 'normal',
        startAddress: 96,
        doorKey: 'door4',
        bucket: deviceBucketList?.[3].bucket
      }
    ]
  }, [
    bucketInfo,
    weightState?.one,
    weightState?.two,
    weightState?.three,
    weightState?.four,
    putterState?.门1满仓报警?.value,
    putterState?.门2满仓报警?.value,
    putterState?.门3满仓报警?.value,
    putterState?.门4满仓报警?.value
  ])

  const { openPutterDevice, countdown } = useDeliveryAction({
    onCountdownEnd(result) {
      openSet(false)
      const { weight, score } = result
      const chineseWeight = numberToChinese(convertToKg(weight))
      const texts = [
        `本次投递重量`,
        ...chineseWeight.split(''),
        '千克',
        '本次投递获得积分',
        ...numberToChinese(score).split('')
      ]
      speakConfigSet({
        open: true,
        texts
      })
      showModal({
        type: 'success',
        title: '投递成功',
        content: (
          <>
            <div className="text-xl font-bold">投递重量：{convertToKg(result.weight)}KG</div>
            <div className="text-xl font-bold">获得积分：{result.score}</div>
          </>
        ),
        durationMs: 10 * 1000,
        footer: null,
        centered: true
      })

      if (loginUser) {
        getScoreData()
      }
    }
  })
  const [open, openSet] = useState(false)

  const { showModal, contextHolder } = useAutoCloseModal()

  const [speakerConfig, speakConfigSet] = useState<{ open: boolean; texts: string[] }>({
    open: false,
    texts: []
  })

  const { opened } = usePutterState()

  const handleOpenPutterDevice = useCallback(
    (bin: TrashBin) => {
      if (!opened) {
        showModal({
          type: 'error',
          title: '仓门设备未连接',
          content: '请先连接仓门设备',
          durationMs: 5000,
          footer: null,
          centered: true
        })
        return
      }
      // 判断是否满仓
      if (bin.status === 'fault') {
        showModal({
          type: 'error',
          title: '满仓提示',
          content: '该垃圾箱已满仓，请等待清运',
          durationMs: 5000,
          footer: null,
          centered: true
        })
        speakConfigSet({
          open: true,
          texts: ['该垃圾箱已满仓，请等待清运']
        })
        return
      }
      const doorTimeConfigList = openDoorTimeConfig?.[bin.doorKey]
      if (!doorTimeConfigList?.length) {
        message.error('请先配置时间')
        return
      }
      const isTimeOK = doorTimeConfigList.some((item) => {
        const { startTime, endTime } = item
        return isTimeInRange(startTime, endTime, dayjs().format('YYYY-MM-DD HH:mm:ss'))
      })
      if (!isTimeOK) {
        showModal({
          type: 'error',
          title: '投放时段提示',
          content: '很抱歉，当前不在投放时段，请按时投放',
          durationMs: 5000,
          footer: null,
          centered: true
        })
        speakConfigSet({
          open: true,
          texts: ['很抱歉，当前不在投放时段，请按时投放']
        })
        return
      }
      // 开启投递流程
      openPutterDevice(bin.startAddress, bin.doorKey)
      openSet(true)
      speakConfigSet({
        open: true,
        texts: ['仓门已打开，请尽快投递']
      })
    },
    [openDoorTimeConfig, openPutterDevice, opened, showModal]
  )

  const config = useLocalConfigStore((state) => state.config)

  const disabled = useMemo(() => {
    if (!opened) {
      return true
    }
    if (config?.canPutWithoutAuth) {
      return false
    }
    return !loginUser
  }, [config?.canPutWithoutAuth, loginUser, opened])

  const handleIdentifySuccess = useCallback(
    async (result: GarbageInfo[]) => {
      if (result?.length) {
        const bins = trashBins.filter((item) =>
          result.some((garbage) => garbage.type === item.name)
        )
        for (const bin of bins) {
          handleOpenPutterDevice(bin)
          await sleep(1000)
        }
      }
    },
    [handleOpenPutterDevice, trashBins]
  )

  const { data: token } = useRequest(
    async () => {
      return callApi('getWsToken')
    },
    {
      pollingInterval: 1000 * 60 * 60
    }
  )

  return (
    <>
      <div className="p-2">
        <div className=" rounded-lg h-[190px] p-2">
          <div className="grid grid-cols-4 gap-8">
            {trashBins.map((bin) => (
              <Card key={bin.doorKey} className="">
                <Card.Meta
                  title={
                    <div>
                      <span>{bin.name}</span>
                      <Tag color={bin.status === 'normal' ? 'success' : 'error'} className="ml-2">
                        {bin.status === 'normal' ? '正常' : '满仓'}
                      </Tag>
                    </div>
                  }
                  description={
                    <>
                      <div className="flex items-center flex-col space-x-4 py-2">
                        <span>当前重量</span>
                        <span className="font-bold text-2xl text-black">{bin.weight}KG</span>
                      </div>
                      <Button
                        block
                        disabled={disabled}
                        type="primary"
                        className="bg-primary"
                        onClick={() => handleOpenPutterDevice(bin)}
                        size="large"
                      >
                        {!opened ? '仓门设备未连接' : !disabled ? '点击开门' : '登录后点击开门'}
                      </Button>
                    </>
                  }
                />
              </Card>
            ))}
          </div>
        </div>
      </div>
      {open && <DoorOpenStatusModal countdown={countdown} onClose={() => openSet(false)} />}
      {contextHolder}
      {speakerConfig.open && (
        <ChineseNumberSpeaker
          texts={speakerConfig.texts}
          onPlayEnd={() => speakConfigSet({ open: false, texts: [] })}
        />
      )}
      {token && loginUser?.token && (
        <RealTimeSpeechRecognition token={token} onIdentifySuccess={handleIdentifySuccess} />
      )}
    </>
  )
}

export default TrashList

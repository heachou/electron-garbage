import { callApi } from '@renderer/utils'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface IUseGarbageKindState {
  garbageKindList: Record<
    'kitchenWaste' | 'hazardousWaste' | 'recyclableWaste' | 'otherWaste',
    string[]
  >
}

const garbageTypes = ['kitchenWaste', 'hazardousWaste', 'recyclableWaste', 'otherWaste']

const parseText = (text: string) => {
  return text
    .replaceAll('\t', ' ')
    .replaceAll('，', ' ')
    .replaceAll(',', ' ')
    .replaceAll('\n', ' ')
    .split(' ')
    .filter((item) => item.trim())
}

interface IDispatch {
  fetchGarbageKindList: () => Promise<void>
}
// @ts-ignore 暂时忽略类型错误
const useGarbageKindStore = create<IUseGarbageKindState & IDispatch>()(
  immer((set, get) => ({
    garbageKindList: {
      kitchenWaste: [],
      hazardousWaste: [],
      recyclableWaste: [],
      otherWaste: []
    },
    fetchGarbageKindList: async () => {
      const medias = await callApi('getMediaList', {})
      const garbageKindUrls = medias
        .filter((item) => garbageTypes.includes(item.location))
        .reduce(
          (prev, media) => {
            prev[media.location].push(...media.filePath)
            return prev
          },
          {
            kitchenWaste: [],
            hazardousWaste: [],
            recyclableWaste: [],
            otherWaste: []
          }
        )

      const garbageKindList = {}
      for (const type of garbageTypes) {
        const urls = garbageKindUrls[type]
        const garbageKind: string[] = []
        for (const url of urls) {
          const data = (await callApi('getGarbageKindList', url)) as unknown as string
          garbageKind.push(...parseText(data))
        }
        garbageKindList[type] = Array.from(new Set(garbageKind))
      }

      set({
        garbageKindList: garbageKindList as IUseGarbageKindState['garbageKindList']
      })
    }
  }))
)

export default useGarbageKindStore

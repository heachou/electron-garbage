import { callApi } from '@renderer/utils'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface PutEquipmentState {
  weightState: Record<'one' | 'two' | 'three' | 'four', number> | undefined
  weightConfigState: Record<string, unknown>
  opened: boolean
  openWeightDevicePort: () => Promise<void>
  onDisconnect: () => void
  getOpened: () => Promise<boolean>
  updateWeightDeviceState: (newState: number[]) => void
  updateWeightConfigState: (newState: Record<string, unknown>) => void
}

const useWeightDeviceStore = create<PutEquipmentState>()(
  immer((set) => ({
    weightState: undefined,
    weightConfigState: {},
    // 状态
    opened: false,
    getOpened: async () => {
      const result = await callApi('getWeightDeviceOpenedState')
      set((state) => {
        state.opened = result
      })
      return result
    },
    updateWeightConfigState: (newState: Record<string, unknown>) => {
      set((state) => {
        state.weightConfigState = {
          ...state.weightConfigState,
          ...newState
        }
      })
    },
    openWeightDevicePort: async () => {
      try {
        await callApi('openWeightDevicePort')
        setTimeout(async () => {
          set((state) => {
            state.opened = true
          })
        }, 1500)
      } catch (error) {
        console.log(error)
        set((state) => {
          state.opened = false
        })
        return Promise.reject(error)
      }
    },
    onDisconnect: () => {
      set((state) => {
        state.opened = false
      })
    },
    // 更新state
    updateWeightDeviceState: (newState: number[]) => {
      set((state) => {
        state.weightState = {
          one: newState[0],
          two: newState[1],
          three: newState[2],
          four: newState[3]
        }
      })
    }
  }))
)

export default useWeightDeviceStore

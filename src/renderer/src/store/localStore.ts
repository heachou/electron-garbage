import { callApi } from '@renderer/utils'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface IUseUserInfoState {
  config: ISystemConfig | null
  getConfig: () => void
}

interface IUserInfoDispatch {
  getConfig: () => void
  updateConfig: (key: string | string[], value: unknown) => void
}

const useLocalConfigStore = create<IUseUserInfoState & IUserInfoDispatch>()(
  immer((set) => ({
    config: null,
    async getConfig() {
      const result = await callApi('getLocalConfig')
      set({
        config: result
      })
    },
    async updateConfig(key: string | string[], value: unknown) {
      const config = await callApi('setLocalConfig', key, value)
      set((state) => {
        state.config = config
      })
      return config
    }
  }))
)

export default useLocalConfigStore

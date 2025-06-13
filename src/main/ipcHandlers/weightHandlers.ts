import { weightDeviceConfig } from '../data'
import { parseWeightData } from '../utils/weightUtils'
import Service from '../services/service'
import { numberToHexRegisters, parseToWeight } from '../utils/modbusUtils'

const getWeightDevicePort = () => {
  return Service.getInstance().store.get('weightDevicePort') as string
}

export const weightDeviceHandlers = () => {
  return {
    // 打开端口
    openWeightDevicePort: async () => {
      const client = Service.getInstance().modbusClient
      const port = getWeightDevicePort()
      await client.openPort(port, { baudRate: 115200 })
    },
    // 获取开启状态
    getWeightDeviceOpenedState: async () => {
      const client = Service.getInstance().modbusClient
      const port = getWeightDevicePort()
      return client.isPortOpen(port)
    },
    readWeightMultipleRegisters: async (params: {
      startAddress: number // 起始寄存器地址 (0-65535)
      registerCount: number // 读取寄存器数量 (1-125)
    }) => {
      const port = getWeightDevicePort()
      const client = Service.getInstance().modbusClient
      const rawResult = (await client.readRegisters({
        deviceAddress: 0x01,
        ...params,
        port,
        bufferReturn: true
      })) as Buffer<ArrayBufferLike>
      return parseToWeight(rawResult)
    },
    getAllWeightData: async () => {
      const port = getWeightDevicePort()
      const client = Service.getInstance().modbusClient
      const rawResult1 = (await client.readRegisters({
        deviceAddress: 0x01,
        startAddress: 0,
        registerCount: 50,
        port,
        bufferReturn: true
      })) as Buffer<ArrayBufferLike>
      const rawResult2 = (await client.readRegisters({
        deviceAddress: 0x01,
        startAddress: 50,
        registerCount: 50,
        port,
        bufferReturn: true
      })) as Buffer<ArrayBufferLike>
      const rawResult3 = (await client.readRegisters({
        deviceAddress: 0x01,
        startAddress: 100,
        registerCount: 52,
        port,
        bufferReturn: true
      })) as Buffer<ArrayBufferLike>
      const rawResult = Buffer.concat([rawResult1, rawResult2, rawResult3])
      const parsedArray = parseWeightData(rawResult, weightDeviceConfig)
      return parsedArray
    },
    writeWeightSingleRegisters: async (params: {
      startAddress: number // 起始寄存器地址 (0-65535)
      value: number // 要写入的值 (0-65535)
    }) => {
      const port = getWeightDevicePort()
      const client = Service.getInstance().modbusClient
      const result = await client.writeSingleRegisters({
        deviceAddress: 0x01,
        ...params,
        port
      })
      return result
    },
    writeWeightMultipleRegisters: async (params: {
      startAddress: number // 起始寄存器地址 (0-65535)
      value: number
      registerCount: number // 要写入的寄存器数量 (1-123)
    }) => {
      const port = getWeightDevicePort()
      const client = Service.getInstance().modbusClient
      const values = numberToHexRegisters(params.value, params.registerCount || 2)
      const result = await client.writeMultipleRegisters({
        deviceAddress: 0x01,
        startAddress: params.startAddress,
        values,
        port
      })
      return result
    }
  }
}

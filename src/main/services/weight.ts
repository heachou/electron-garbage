import { SerialPort } from 'serialport'
import request from '../utils/request'
import { getAppId } from './app'
import Service from './service'

export const listDevices = async (): Promise<IDeviceInfo[]> => {
  const list = await SerialPort.list()
  const client = Service.getInstance().modbusClient
  return list.map((item) => {
    return {
      path: item.path,
      manufacturer: item.manufacturer,
      locationId: item.locationId,
      productId: item.productId,
      vendorId: item.vendorId,
      open: client.isPortOpen(item.path)
    }
  })
}

// 上传称重数据
export const uploadPutInWeight = async (weight: number[]): Promise<IPutInWeightRes> => {
  console.log('🚀 ~ uploadPutInWeight ~ uploadPutInWeight:', weight)
  const { data } = await request.post('/mini/api/device/putIn', {
    weight,
    imei: await getAppId(),
    time: Date.now()
  })
  return data
}

// 查询设备信息
export const getBucketInfo = async (): Promise<IDeviceInfoRes> => {
  const { data } = await request.get('/mini/api/device/info', {
    params: {
      code: await getAppId()
    }
  })
  return data
}

import { convertUInt16 } from './dataTypeUtils'

interface WeightConfigItem {
  address: number
  name: string
  dataType: 'uint16' | 'int16' | 'bool' | 'string' | string // Extend with other types as necessary
  decimalPoints?: number
  registerCount?: number // Number of registers for this item (e.g., for strings)
  rawValue?: number
}

export const parseWeightData = (
  rawResult: Buffer,
  config: WeightConfigItem[]
): Array<WeightConfigItem & { value: any }> => {
  const results: Array<WeightConfigItem & { value: any }> = []
  let currentOffset = 0

  for (const item of config) {
    const { address, name, registerCount = 1, decimalPoints = 0 } = item
    const bytesPerRegister = 2
    const byteLengthToRead = registerCount * bytesPerRegister

    if (currentOffset + byteLengthToRead > rawResult.length) {
      console.warn(
        `Address ${address} for '${name}' (registers: ${registerCount}, bytes: ${byteLengthToRead}) is out of bounds for the received data buffer (length: ${rawResult.length}).`
      )
      results.push({ ...item, value: undefined })
      continue
    }

    let value: number = 0
    if (registerCount === 2) {
      // 4字节为一组处理
      value =
        (rawResult[currentOffset] << 24) |
        (rawResult[currentOffset + 1] << 16) |
        (rawResult[currentOffset + 2] << 8) |
        rawResult[currentOffset + 3]
    } else {
      // 2字节为一组处理
      value = (rawResult[currentOffset] << 8) | rawResult[currentOffset + 1]
    }

    currentOffset += byteLengthToRead
    results.push({ ...item, value: convertUInt16(value, decimalPoints), rawValue: value })
  }
  return results
}

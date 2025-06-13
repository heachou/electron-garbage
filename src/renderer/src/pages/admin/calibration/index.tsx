import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Form, InputNumber, message, Select, Switch, Typography } from 'antd'
import { useShallow } from 'zustand/react/shallow'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { callApi } from '@renderer/utils'
import { TRegisterConfigNames, weightDeviceConfig } from '@/main/data'
import useWeightDeviceStore from '@renderer/store/weightDeviceStore'

const { Title } = Typography

// 类型定义
type RegisterConfig = {
  address: number
  name: string
  dataType: string
  decimalPoints?: number
  unit?: string
  readOnly?: boolean
  min?: number // 添加 min
  max?: number // 添加 max
  options?: { label: string; value: string | number }[] // 添加 options
  registerCount?: number
}

interface UpdateTask {
  address: number
  value: number | boolean // 表单中的值
  rawValue: number // 转换后发送给 API 的值
  config: RegisterConfig // 对应的配置项
}

const Calibration = () => {
  const [form] = Form.useForm()
  const { weightConfigState } = useWeightDeviceStore(
    useShallow((state) => {
      return {
        weightConfigState: state.weightConfigState
      }
    })
  )

  // 状态：更新队列和处理状态
  const [updateQueue, setUpdateQueue] = useState<UpdateTask[]>([])
  const isProcessingQueue = useRef(false) // 使用 ref 避免不必要的重渲染

  const formValues = useMemo(() => {
    return weightDeviceConfig.reduce(
      (acc, config) => {
        acc[`addr_${config.address}`] = weightConfigState?.[config.name]?.value
        return acc
      },
      {} as Record<string, unknown>
    )
  }, [weightConfigState])

  useEffect(() => {
    if (formValues) {
      form.setFieldsValue(formValues)
    }
  }, [form, formValues])

  // 渲染配置项 (修正 InputNumber 的 min/max)
  const renderFormItem = (config: RegisterConfig) => {
    if (config.dataType === 'bool') {
      return (
        <Form.Item
          key={`item_${config.address}`} // 确保有 key
          name={`addr_${config.address}`}
          label={`${config.name}`}
          valuePropName="checked"
        >
          <Switch disabled={config.readOnly} />
        </Form.Item>
      )
    }

    // 如果有 options，渲染 Select 组件
    if (config.options && Array.isArray(config.options)) {
      return (
        <Form.Item
          key={`item_${config.address}`}
          name={`addr_${config.address}`}
          label={`${config.name}`}
        >
          <Select
            disabled={config.readOnly}
            placeholder={`请选择${config.name}`}
            style={{ width: 160 }}
          >
            {config.options.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )
    }

    if (config.readOnly) {
      return (
        <Form.Item key={`item_${config.address}`} label={`${config.name}`}>
          <span className="ant-form-text">
            {weightConfigState?.[config.name as TRegisterConfigNames]?.value?.toString() ?? 'N/A'}{' '}
            {config.unit ?? ''}
          </span>
        </Form.Item>
      )
    }

    return (
      <Form.Item
        key={`item_${config.address}`} // 确保有 key
        name={`addr_${config.address}`}
        label={`${config.name}`}
        rules={[
          // 保留这里的 rules 以提供即时反馈
          { required: !config.readOnly, message: `请输入${config.name}` }, // 只对非只读项要求必填
          {
            validator: async (_, value) => {
              if (value === null || value === undefined || config.readOnly) {
                // 只读项不校验
                return
              }
              if (typeof value === 'number') {
                if (config.min !== undefined && value < config.min) {
                  throw new Error(`值必须大于或等于 ${config.min}`)
                }
                if (config.max !== undefined && value > config.max) {
                  throw new Error(`值必须小于或等于 ${config.max}`)
                }
              }
            }
          }
        ]}
      >
        <InputNumber
          disabled={config.readOnly}
          min={config.min} // 使用 config.min
          max={config.max} // 使用 config.max
          placeholder="请输入"
          precision={config.decimalPoints}
          addonAfter={config.unit}
          style={{ width: 160 }}
        />
      </Form.Item>
    )
  }

  // 按功能模块分组
  const moduleGroups = useMemo(() => {
    return [
      {
        title: '重量信息',
        range: [0, 30],
        columns: 4
      },
      {
        title: '配置',
        range: [31, 67],
        columns: 3
      },
      // {
      //   title: 'AD 值',
      //   range: [68, 98],
      //   columns: 4
      // },
      {
        title: '校正',
        range: [116, 146],
        columns: 4
      }
    ]
  }, [])

  const navigate = useNavigate()
  const [messageApi, messageContext] = message.useMessage()
  const { runAsync: updateWeightConfigAction } = useRequest(
    async (task: UpdateTask) => {
      if (task.config?.registerCount === 2) {
        return callApi('writeWeightMultipleRegisters', {
          startAddress: task.address,
          value: task.rawValue,
          registerCount: task.config.registerCount
        })
      }
      return callApi('writeWeightSingleRegisters', {
        startAddress: task.address,
        value: task.rawValue
      })
    },
    {
      manual: true,
      onError: (error, params) => {
        const task = params[0] as UpdateTask
        console.error(`Error updating ${task.config.name} (Address ${task.address}):`, error)
        // 可选：将失败的任务重新放回队列或标记为失败
        messageApi.error(`更新${task.config.name}失败`)
      },
      onSuccess(_, [task]) {
        messageApi.success(`成功更新${task.config.name}，值为${task.value}`)
      },
      onFinally: () => {
        // 不论成功或失败，都尝试处理下一个任务
        processNextTask()
      }
    }
  )

  // 处理队列中的下一个任务
  const processNextTask = useCallback(() => {
    setUpdateQueue((currentQueue) => {
      if (currentQueue.length === 0) {
        isProcessingQueue.current = false
        return []
      }
      const nextTask = currentQueue[0]
      updateWeightConfigAction(nextTask)
      return currentQueue.slice(1)
    })
  }, [updateWeightConfigAction])

  // 启动队列处理（如果未在处理中）
  const startQueueProcessing = useCallback(() => {
    if (!isProcessingQueue.current) {
      isProcessingQueue.current = true
      processNextTask()
    }
  }, [processNextTask]) // 依赖队列长度和处理函数

  // 表单值变化时的处理函数 (修正验证逻辑)
  const handleValuesChange = useCallback(
    async (changedValues: Record<string, unknown>) => {
      const tasksToAdd: UpdateTask[] = []
      const validationPromises: Promise<void>[] = [] // 存储验证的 Promise

      for (const key in changedValues) {
        if (Object.prototype.hasOwnProperty.call(changedValues, key)) {
          const value = changedValues[key] as number | boolean
          const addressMatch = key.match(/^addr_(\d+)$/)

          if (addressMatch && value !== undefined && value !== null) {
            const address = parseInt(addressMatch[1], 10)
            const config = weightDeviceConfig.find((c) => c.address === address) as RegisterConfig

            if (config && !config.readOnly) {
              // 1. 转换 rawValue
              let rawValue: number
              if (config.dataType === 'bool') {
                rawValue = value ? 1 : 0
              } else if (config.decimalPoints && typeof value === 'number') {
                rawValue = Math.round(value * Math.pow(10, config.decimalPoints))
              } else if (typeof value === 'number') {
                rawValue = value
              } else {
                console.warn(`Skipping update for ${key}: Cannot convert value ${value} to number.`)
                continue
              }

              const validationPromise = form
                .validateFields([key])
                .then(() => {
                  // 验证通过，准备添加任务
                  console.log(`Validation passed for ${key}`)
                  tasksToAdd.push({ address, value, rawValue, config })
                })
                .catch((errorInfo) => {
                  // 验证失败，Form 会显示错误，这里记录日志
                  console.log(`Validation failed for ${key}:`, errorInfo)
                })
              validationPromises.push(validationPromise)
            }
          }
        }
      }

      // 4. 等待所有验证完成
      Promise.all(validationPromises).then(() => {
        // 所有验证（可能成功或失败）都已结束
        if (tasksToAdd.length > 0) {
          setUpdateQueue((currentQueue) => [...currentQueue, ...tasksToAdd])
          // 使用 setTimeout 确保状态更新后执行
          setTimeout(startQueueProcessing, 0)
        }
      })
    },
    [form, startQueueProcessing]
  ) // 添加 form 依赖

  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen relative">
      <div className="flex items-center justify-between">
        <Title level={3} className="mb-6 text-white">
          <span className="text-white">设备配置中心</span>
        </Title>
        <Button
          onClick={() => {
            navigate(-1)
          }}
        >
          返回
        </Button>
      </div>
      <Form form={form} initialValues={formValues} onValuesChange={handleValuesChange}>
        {moduleGroups.map((group, index) => {
          const items = weightDeviceConfig.filter(
            (c) => c.address >= group.range[0] && c.address <= group.range[1]
          )

          const colsClsMap = {
            2: 'grid-cols-2',
            3: 'grid-cols-3',
            4: 'grid-cols-4'
          }

          return (
            <Card
              key={index}
              title={group.title}
              className="mb-6 shadow-sm bg-white border-gray-700 text-white" // 调整样式
            >
              <div className={`grid ${colsClsMap[group.columns]} gap-x-6 gap-y-2`}>
                {/* 调整 gap */}
                {items.map((config) => (
                  <div key={config.address} className="col-span-1">
                    {renderFormItem(config)}
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </Form>
      {messageContext}
    </div>
  )
}

export default Calibration

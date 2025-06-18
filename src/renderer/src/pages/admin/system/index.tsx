import { timeConfigArr } from '@/main/const/config'
import useLocalConfigStore from '@renderer/store/localStore'
import { Button, Card, Form, InputNumber, Switch, TimePicker } from 'antd'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useMemo } from 'react'

const format = 'HH:mm'

const toDayjsRange = (timeRange: string[] = []) => {
  return timeRange?.length ? [dayjs(timeRange?.[0], format), dayjs(timeRange?.[1], format)] : []
}

const SystemConfig = () => {
  const config = useLocalConfigStore((state) => state.config)
  const updateConfig = useLocalConfigStore((state) => state.updateConfig)
  const navigate = useNavigate()

  const formInitialValue = useMemo(() => {
    if (!config) {
      return {}
    }
    const initValue: Record<string, unknown> = {
      ...config
    }
    initValue.auth = {
      ...config.auth,
      timingEnable_1_range: toDayjsRange(config?.auth?.timingEnable_1_range),
      timingEnable_2_range: toDayjsRange(config?.auth?.timingEnable_2_range),
      timingEnable_3_range: toDayjsRange(config?.auth?.timingEnable_3_range),
      timingEnable_4_range: toDayjsRange(config?.auth?.timingEnable_4_range)
    }
    initValue.unAuth = {
      ...config.unAuth,
      timingEnable_1_range: toDayjsRange(config?.unAuth?.timingEnable_1_range),
      timingEnable_2_range: toDayjsRange(config?.unAuth?.timingEnable_2_range),
      timingEnable_3_range: toDayjsRange(config?.unAuth?.timingEnable_3_range),
      timingEnable_4_range: toDayjsRange(config?.unAuth?.timingEnable_4_range)
    }
    return initValue
  }, [config])

  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen relative space-y-4 py-10">
      <Button onClick={() => navigate(-1)}>返回</Button>
      <Card title="系统配置">
        <Form initialValues={formInitialValue}>
          <Form.Item label="未登录投递时段配置">
            {timeConfigArr.map((config) => {
              return (
                <div className="flex items-center gap-x-6" key={config.label}>
                  <Form.Item label={config.label} name={config.unAuthName} key={config.label}>
                    <Switch onChange={(value) => updateConfig(config.unAuthName, value)} />
                  </Form.Item>
                  <Form.Item label={config.timeConfig.label} name={config.timeConfig.unAuthName}>
                    <TimePicker.RangePicker
                      format={'HH:mm'}
                      placeholder={['开始时间', '结束时间']}
                      allowClear={false}
                      onChange={(value) => {
                        if (value?.length) {
                          updateConfig(
                            config.timeConfig.unAuthName,
                            value.map((item) => item!.format(format))
                          )
                        }
                      }}
                    />
                  </Form.Item>
                </div>
              )
            })}
          </Form.Item>
          <Form.Item label="已登录投递时段配置">
            {timeConfigArr.map((config) => {
              return (
                <div className="flex items-center gap-x-6" key={config.label}>
                  <Form.Item label={config.label} name={config.authName} key={config.label}>
                    <Switch onChange={(value) => updateConfig(config.authName, value)} />
                  </Form.Item>
                  <Form.Item label={config.timeConfig.label} name={config.timeConfig.name}>
                    <TimePicker.RangePicker
                      format={'HH:mm'}
                      placeholder={['开始时间', '结束时间']}
                      allowClear={false}
                      onChange={(value) => {
                        if (value?.length) {
                          updateConfig(
                            config.timeConfig.name,
                            value.map((item) => item!.format(format))
                          )
                        }
                      }}
                    />
                  </Form.Item>
                </div>
              )
            })}
          </Form.Item>
          <Form.Item label="最长在线时长" name={'maxOnlineTime'}>
            <InputNumber
              className="w-40"
              placeholder="最长在线时长"
              addonAfter="秒"
              min={10}
              max={1800}
              onChange={(value) => updateConfig('maxOnlineTime', value || 180)}
            />
          </Form.Item>
          <Form.Item label="屏幕保护程序" name={'screenSaver'}>
            <InputNumber
              className="w-40"
              placeholder="屏幕保护程序"
              addonAfter="分钟"
              min={1}
              max={60}
              onChange={(value) => updateConfig('screenSaver', value || 15)}
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default SystemConfig

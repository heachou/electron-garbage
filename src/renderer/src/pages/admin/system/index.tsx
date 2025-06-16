import useLocalConfigStore from '@renderer/store/localStore'
import { Button, Card, Form, InputNumber, Switch } from 'antd'
import { useNavigate } from 'react-router-dom'

const SystemConfig = () => {
  const config = useLocalConfigStore((state) => state.config)
  const updateConfig = useLocalConfigStore((state) => state.updateConfig)
  const navigate = useNavigate()
  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen relative space-y-4 py-10">
      <Button onClick={() => navigate(-1)}>返回</Button>
      <Card title="系统配置">
        <Form
          initialValues={{
            ...config
          }}
        >
          <Form.Item label="未登录允许投递" name={'canPutWithoutAuth'}>
            <Switch onChange={(checked: boolean) => updateConfig('canPutWithoutAuth', checked)} />
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

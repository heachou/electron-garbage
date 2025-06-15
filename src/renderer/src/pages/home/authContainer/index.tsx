import { Button, Card, List, Typography } from 'antd'
import UnAuth from './unAuth'
import useUserStore from '@renderer/store/userStore'
import Authed from './authed'
import { QrcodeOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useRequest } from 'ahooks'
import { callApi, convertToKg } from '@renderer/utils'
import AutoCloseModal from '@renderer/components/autoCloseModal'
import dayjs from 'dayjs'

const { Text } = Typography

const LoginContainer = () => {
  const [open, showDeviceCodeModal] = useState(false)
  const user = useUserStore((state) => state.userInfo)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const { data: code } = useRequest(async () => {
    return callApi('getAppId')
  })

  const { data: bucketInfo } = useRequest(async () => callApi('getBucketInfo'), {
    cacheKey: 'getBucketInfo'
  })

  const { data: putInReccordsRes, run: getPutInRecords } = useRequest(
    async () => {
      return callApi('getDevicePutInRecord', {
        deviceId: bucketInfo!.id,
        pageNum: 1,
        pageSize: 100
      })
    },
    {
      ready: !!bucketInfo?.id,
      manual: true
    }
  )
  console.log('🚀 ~ LoginContainer ~ putInReccordsRes:', putInReccordsRes)

  const showModal = () => {
    setIsModalVisible(true)
    getPutInRecords()
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <div className="flex-1 min-h-0 px-2 relative h-full">
        <div className="bg-white flex w-full h-full justify-center items-center rounded-md">
          <Card className="w-full shadow-none border-none">{user ? <Authed /> : <UnAuth />}</Card>
        </div>
        <span
          className="absolute right-4 bottom-2 flex items-center justify-center space-x-1 cursor-pointer text-gray-700"
          onClick={() => showDeviceCodeModal(true)}
        >
          <span className="text-xs">设备码</span>
          <QrcodeOutlined className="text-2xl" />
        </span>
      </div>
      <Button
        onClick={showModal}
        className="absolute right-8 top-4 bg-primary text-white"
        type="primary"
      >
        设备投递记录
      </Button>
      <AutoCloseModal
        title="设备投递记录"
        duration={60}
        open={isModalVisible}
        onCancel={handleCancel}
        width={600}
        centered
        okText="关闭"
        cancelButtonProps={{
          className: 'hidden'
        }}
        onOk={handleCancel}
      >
        <List
          itemLayout="horizontal"
          dataSource={putInReccordsRes?.rows || []}
          pagination={false}
          size="small"
          locale={{ emptyText: '暂无投递记录' }}
        >
          <div className="max-h-96 overflow-auto">
            {putInReccordsRes?.rows?.map((item) => {
              return (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    title={null}
                    description={
                      <div className="flex justify-between py-2">
                        <div className="flex space-x-4">
                          <Text strong>{item.category}</Text>
                          <Text>重量: {convertToKg(item.weight)} kg</Text>
                        </div>
                        <Text type="secondary">
                          时间: {dayjs(item.createTime).format('YYYY-MM-DD HH:mm')}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )
            })}
          </div>
        </List>
      </AutoCloseModal>
      <AutoCloseModal
        title="设备码"
        open={open}
        onCancel={() => showDeviceCodeModal(false)}
        footer={null}
        width={400}
        centered
        duration={40}
      >
        <div className="text-center flex items-center flex-col space-y-2">
          {code && <QRCodeSVG value={code} />}
          <div>设备码：{code}</div>
        </div>
      </AutoCloseModal>
    </>
  )
}

export default LoginContainer

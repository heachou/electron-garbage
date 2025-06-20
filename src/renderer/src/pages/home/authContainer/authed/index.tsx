import { useState, useMemo } from 'react'
import { Avatar, Button, Typography, Statistic, Alert, Space, Divider } from 'antd' // 引入 Ant Design 组件
import { LogoutOutlined, RiseOutlined } from '@ant-design/icons' // 引入图标
import PutInStatModal from './putInStatModal'
import FaceBindModal from './faceBindModal'
import CardBindModal from './cardBindModal'
import useUserStore from '@renderer/store/userStore'
import { mediaDomain, defaultAvatarUrl } from '@renderer/const'
import useLocalConfigStore from '@renderer/store/localStore'
import { useCountDown } from 'ahooks'

const { Title, Text } = Typography

const Authed = () => {
  const userInfo = useUserStore((state) => state.userInfo)
  const scoreData = useUserStore((state) => state.scoreData)
  const [isModalVisible, showPutInStatModalOpen] = useState(false)
  const config = useLocalConfigStore((state) => state.config)

  const logout = useUserStore((state) => state.logout)

  const [leftTime] = useCountDown({
    leftTime: (config?.maxOnlineTime || 180) * 1000,
    onEnd: () => {
      logout()
    }
  })
  console.log('🚀 ~ Authed ~ leftTime:', leftTime)

  const avatarUrl = userInfo?.avatar ? `${mediaDomain}${userInfo.avatar}` : defaultAvatarUrl

  const addressText = useMemo(() => {
    const { residentialCommunity, building, cell } = userInfo || {}
    return [residentialCommunity, building, cell].filter(Boolean).join('')
  }, [userInfo])

  const [faceBindModalOpen, faceBindModalOpenSet] = useState(false)
  const [cardBindModalOpen, cardBindModalOpenSet] = useState(false)

  if (!userInfo) {
    return null
  }

  return (
    <>
      <div className="h-full min-h-0 flex-1 flex flex-col">
        <div className="flex flex-col pb-3 pt-10">
          <Space size="middle">
            <Avatar size={80} src={avatarUrl} />
            <div>
              <Title level={3} className="mb-0">
                {userInfo.realName || userInfo.name || '用户昵称'}{' '}
              </Title>
              <Text type="secondary">{addressText ? `(${addressText})` : '欢迎回来！'} </Text>
            </div>
          </Space>
          <Divider />
        </div>
        {/* 主体：用户积分 */}
        <div className="space-y-6 flex-col flex items-center justify-center">
          <Statistic
            title="当前积分"
            value={scoreData?.scoreStat.score || 0}
            precision={0}
            valueStyle={{ color: '#3f8600', textAlign: 'center', fontSize: 48 }}
          />
          <div className="flex w-[400px] justify-between">
            <Statistic
              title="截止昨日积分"
              value={scoreData?.scoreStat.asOfYesterdayScore || 0}
              precision={0}
              valueStyle={{ color: '#3f8600', textAlign: 'center', fontSize: 32 }}
            />
            <Statistic
              title="今日新增积分"
              value={scoreData?.scoreStat.todayAddScore || 0}
              precision={0}
              valueStyle={{ color: '#3f8600', textAlign: 'center', fontSize: 32 }}
            />
          </div>
          <div className="space-x-6">
            {userInfo.faces?.length ? null : (
              <Button
                className="bg-primary"
                type="primary"
                onClick={() => faceBindModalOpenSet(true)}
              >
                绑定人脸识别
              </Button>
            )}
            {userInfo.cardNo ? null : (
              <Button
                type="primary"
                className="bg-primary"
                onClick={() => cardBindModalOpenSet(true)}
              >
                绑定卡号
              </Button>
            )}
            <Button
              type="primary"
              icon={<RiseOutlined />}
              className="bg-primary"
              onClick={() => showPutInStatModalOpen(true)}
            >
              我的投递记录
            </Button>
          </div>
          <Alert
            className="py-3 text-base w-full"
            description={`请在规定的时间内完成投递，否则需要再次扫码/刷卡开门。系统将于 ${Math.round(leftTime / 1000)} 秒后自动注销`}
            type="warning"
          />
          <Button
            type="primary"
            block
            danger
            icon={<LogoutOutlined />}
            onClick={logout}
            size="large"
          >
            退出登录
          </Button>
        </div>
      </div>
      <PutInStatModal visible={isModalVisible} onClose={() => showPutInStatModalOpen(false)} />
      <FaceBindModal open={faceBindModalOpen} onClose={() => faceBindModalOpenSet(false)} />
      <CardBindModal open={cardBindModalOpen} onClose={() => cardBindModalOpenSet(false)} />
    </>
  )
}

export default Authed

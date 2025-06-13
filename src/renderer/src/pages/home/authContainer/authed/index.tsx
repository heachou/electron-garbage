import { useState, useEffect, useMemo } from 'react'
import { Avatar, Button, Typography, Statistic, Alert, Space } from 'antd' // 引入 Ant Design 组件
import { UserOutlined, LogoutOutlined, RiseOutlined } from '@ant-design/icons' // 引入图标
import PutInStatModal from './putInStatModal'
import FaceBindModal from './faceBindModal'
import CardBindModal from './cardBindModal'
import useUserStore from '@renderer/store/userStore'
import { LOGOUT_DELAY_SECONDS, mediaDomain, defaultAvatarUrl } from '@renderer/const'
import { useRequest } from 'ahooks'
import { callApi } from '@renderer/utils'

const { Title, Text } = Typography

const Authed = () => {
  const userInfo = useUserStore((state) => state.userInfo)
  const scoreData = useUserStore((state) => state.scoreData)
  const [isModalVisible, showPutInStatModalOpen] = useState(false)

  const logout = useUserStore((state) => state.logout)
  // 注意：这里的倒计时仅用于 UI 显示，实际的登出逻辑由 userStore 控制
  const [countdown, setCountdown] = useState(LOGOUT_DELAY_SECONDS)

  useEffect(() => {
    // 当用户信息存在时，启动 UI 倒计时
    if (userInfo) {
      setCountdown(LOGOUT_DELAY_SECONDS) // 重置倒计时
      const intervalId = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(intervalId)
            // 理论上 store 的定时器会触发 logout，这里 UI 倒计时结束
            // 可以选择在这里也调用 logout 以防万一，但可能会重复调用
            // logout();
            return 0
          }
          return prevCount - 1
        })
      }, 1000)

      // 清理函数：组件卸载或 userInfo 变化时清除 interval
      return () => clearInterval(intervalId)
    } else {
      // 如果没有用户信息（例如已登出），重置倒计时显示
      setCountdown(LOGOUT_DELAY_SECONDS)
    }
  }, [userInfo]) // 依赖 userInfo，当它变化时重新执行 effect

  const avatarUrl = userInfo?.avatar ? `${mediaDomain}${userInfo.avatar}` : defaultAvatarUrl // 假设 userInfo.faces 是一个数组，我们取第一个作为 avat

  const addressText = useMemo(() => {
    const { residentialCommunity, building, cell } = userInfo || {}
    return [residentialCommunity, building, cell].filter(Boolean).join('')
  }, [userInfo])

  const [faceBindModalOpen, faceBindModalOpenSet] = useState(false)
  const [cardBindModalOpen, cardBindModalOpenSet] = useState(false)

  // 如果没有用户信息，理论上不应该渲染这个组件，但加个保护
  if (!userInfo) {
    return null // 或者显示一个加载/未授权状态
  }

  return (
    <>
      <div className="flex flex-col space-y-3 h-full">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <Space size="middle">
            <Avatar size={48} icon={<UserOutlined />} src={avatarUrl} />
            <div>
              <Title level={5} className="mb-0">
                {userInfo.realName || userInfo.name || '用户昵称'}{' '}
                {addressText ? `(${addressText})` : null}
              </Title>
              <Text type="secondary">欢迎回来！</Text>
            </div>
          </Space>
          <div className="space-x-6">
            {userInfo.faces?.length ? null : (
              <Button type="primary" onClick={() => faceBindModalOpenSet(true)}>
                绑定人脸识别
              </Button>
            )}
            {userInfo.cardNo ? null : (
              <Button type="primary" onClick={() => cardBindModalOpenSet(true)}>
                绑定卡号
              </Button>
            )}
            <Button
              type="primary"
              icon={<RiseOutlined />}
              onClick={() => showPutInStatModalOpen(true)}
            >
              投递记录
            </Button>
            <Button type="primary" danger icon={<LogoutOutlined />} onClick={logout}>
              退出登录
            </Button>
          </div>
        </div>
        {/* 主体：用户积分 */}
        <div className="space-y-2 flex-col flex items-center justify-center">
          <Alert
            className="py-3 text-base w-full"
            description={`请在规定的时间内完成投递，否则需要再次扫码/刷卡开门。系统将于 ${countdown} 秒后自动注销`}
            type="warning"
            showIcon
          />
          <Statistic
            title="当前积分"
            value={scoreData?.scoreStat.score || 0}
            precision={0}
            valueStyle={{ color: '#3f8600', textAlign: 'center', fontSize: 36 }}
          />
          <div className="flex w-[400px] justify-between">
            <Statistic
              title="截止昨日积分"
              value={scoreData?.scoreStat.asOfYesterdayScore || 0}
              precision={0}
              valueStyle={{ color: '#3f8600', textAlign: 'center', fontSize: 24 }}
            />
            <Statistic
              title="今日新增积分"
              value={scoreData?.scoreStat.todayAddScore || 0}
              precision={0}
              valueStyle={{ color: '#3f8600', textAlign: 'center', fontSize: 24 }}
            />
          </div>
        </div>
      </div>
      <PutInStatModal visible={isModalVisible} onClose={() => showPutInStatModalOpen(false)} />
      <FaceBindModal open={faceBindModalOpen} onClose={() => faceBindModalOpenSet(false)} />
      <CardBindModal open={cardBindModalOpen} onClose={() => cardBindModalOpenSet(false)} />
    </>
  )
}

export default Authed

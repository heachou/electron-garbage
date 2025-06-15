import { useState, useMemo } from 'react'
import { Input, Button, message, Space } from 'antd'
import { MobileOutlined, LoginOutlined } from '@ant-design/icons' // 引入图标
import { useRequest } from 'ahooks'
import { callApi } from '@renderer/utils'
import useUserStore from '@renderer/store/userStore'

const PhoneLoginContainer = () => {
  const [phone, setPhone] = useState('')
  const [messageApi, messageContext] = message.useMessage() // 用于显示消息提示
  const updateUserInfo = useUserStore((state) => state.updateUserInfo) // 获取更新用户信息的函数

  const isPhoneValid = useMemo(() => /^1\d{10}$/.test(phone), [phone])

  // --- 手机号+验证码登录请求 ---
  const { loading: loginLoading, run: loginRun } = useRequest(
    async (phoneNumber: string) => {
      const userInfo: UserInfo = await callApi('phoneLogin', {
        phone: phoneNumber
      })
      return userInfo
    },
    {
      manual: true, // 手动触发
      onSuccess: (userInfo) => {
        if (userInfo) {
          messageApi.success('登录成功！')
          updateUserInfo(userInfo) // 更新全局用户状态
        } else {
          // 如果 API 可能在业务上成功但未返回 userInfo
          messageApi.error('登录失败，未获取到用户信息')
        }
      },
      onError: (error) => {
        // @ts-ignore TODO
        if (error?.extra?.code === 4004) {
          messageApi.error('该手机号未注册，请扫描小程序，进行注册并绑定手机号码', 10)
          return
        }
        console.log('🚀 ~ PhoneLoginContainer ~ error:', error)
        messageApi.error(error?.message || '登录失败，请检查手机号或验证码')
      }
    }
  )

  const handleLogin = () => {
    if (!isPhoneValid) {
      messageApi.warning('请输入有效的 11 位手机号码')
      return
    }
    loginRun(phone)
  }

  // --- 计算按钮禁用状态 ---
  // 登录按钮：手机号无效 或 验证码长度不足 或 正在登录
  const isLoginDisabled = !isPhoneValid || loginLoading

  return (
    <>
      <div className="flex flex-col rounded-xl w-full">
        <h2 className="text-sm text-gray-600 font-bold mb-8">手机号码登录</h2>
        <Input
          prefix={<MobileOutlined className="text-gray-400 mr-2" />} // 图标和输入框间距
          placeholder="请输入 11 位手机号码"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // 只允许输入数字
          maxLength={11}
          size="large" // 使用大尺寸输入框
          allowClear
          type="tel"
          addonBefore={'+86'}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleLogin()
            }
          }}
          className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        <Button
          type="primary"
          icon={<LoginOutlined />}
          onClick={handleLogin}
          loading={loginLoading}
          disabled={isLoginDisabled}
          size="large"
          className={`w-full rounded-md mt-12 h-[60px] bg-primary text-white hover:bg-primary`}
        >
          登 录
        </Button>
      </div>
      {messageContext}
    </>
  )
}

export default PhoneLoginContainer

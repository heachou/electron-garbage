import { Button, message } from 'antd'
import { useRequest } from 'ahooks'
import { callApi } from '@renderer/utils'
import useBarcodeScanner from '@renderer/hooks/useBarcodeScanner'
import useUserStore from '@renderer/store/userStore'
import AutoCloseModal from '@renderer/components/autoCloseModal'

interface Props {
  open: boolean
  onClose: () => void
}

const MAX_WAIT_TIME = 45

const CardBindModal = ({ open, onClose }: Props) => {
  const refreshUserInfo = useUserStore((state) => state.refreshUserInfo)

  const { loading, run: startCardBind } = useRequest(
    async (cardNo: string) => {
      return callApi('bindCard', { cardNo })
    },
    {
      manual: true,
      ready: open,
      onSuccess: () => {
        message.success('卡号绑定成功')
        refreshUserInfo()
        onClose()
      }
    }
  )

  useBarcodeScanner({
    onScan: startCardBind,
    preventInput: true
  })

  return (
    <AutoCloseModal
      title={
        <div className="flex space-x-2 items-center">
          <span>卡号绑定</span>
        </div>
      }
      open={open}
      centered
      onCancel={() => onClose()}
      duration={MAX_WAIT_TIME}
      footer={[
        <Button key="back" onClick={() => onClose()} loading={loading}>
          取消
        </Button>
      ]}
      width={600}
      height={600}
    >
      <div className="flex flex-col items-center">
        <div className="flex flex-col justify-center items-center mt-4">
          <p className="text-center">请在扫码处进行扫码添加</p>
        </div>
      </div>
    </AutoCloseModal>
  )
}
export default CardBindModal

import { useInactivityTimeout } from '@renderer/hooks/useInactivityTimeout'
import Advertise from './advertise'
import AuthContainer from './authContainer'
import TrashList from './trashList'
import { useNavigate } from 'react-router-dom'
import useLongPress from '@renderer/hooks/useLongPress'
import bg from '@renderer/assets/icons/bg.png'
import useLocalConfigStore from '@renderer/store/localStore'

const Home = () => {
  const navigate = useNavigate()
  const config = useLocalConfigStore((state) => state.config)

  useInactivityTimeout(
    () => {
      navigate('/ads')
    },
    (config?.screenSaver || 15) * 60 * 1000
  )

  const longPressEvents = useLongPress({
    onLongPress: () => {
      navigate('/admin/login')
    }
  })

  return (
    <div className="relative" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}>
      <div className="h-screen py-3 flex items-center">
        <div className="flex-1 flex flex-col space-y-5 h-full min-w-0 justify-between">
          <Advertise />
          <TrashList />
        </div>
        <div className="w-[500px] h-full">
          <AuthContainer />
        </div>
      </div>
      <span
        {...longPressEvents}
        className="absolute cursor-pointer select-none px-4 py-1 rounded left-1/2 -translate-x-1/2 w-40 text-center bg-primary text-white top-0"
      >
        城洁云分类
      </span>
    </div>
  )
}

export default Home

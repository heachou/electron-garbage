import recyclableIcon from '@renderer/assets/icons/recyclable.png'
import otherWasteIcon from '@renderer/assets/icons/other.png'
import hazardousWasteIcon from '@renderer/assets/icons/poison.png'
import foodWasteIcon from '@renderer/assets/icons/kitchen.png'

console.log('🚀 ~ foodWasteIcon:', foodWasteIcon)

export const LOGOUT_DELAY_SECONDS = 1800 // 180 秒

export const mediaDomain = import.meta.env.VITE_API_HOST

export const defaultAvatarUrl =
  'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

export const AUDIO_APP_ID = 'sLn8vbSMMGd8LwlX'

export const garbageTypeConfig = {
  厨余垃圾: {
    name: '厨余垃圾',
    enName: 'Food Waste',
    color: '#00753C',
    icon: foodWasteIcon
  },
  有害垃圾: {
    name: '有害垃圾',
    enName: 'Hazardous Waste',
    color: '#D8232A',
    icon: hazardousWasteIcon
  },

  其他垃圾: {
    name: '其他垃圾',
    enName: 'Residual Waste',
    color: '#6E6F71',
    icon: otherWasteIcon
  },
  可回收物: {
    name: '可回收物',
    enName: 'Recyclable',
    color: '#004B81',
    icon: recyclableIcon
  },
  废品: {
    name: '废品',
    enName: 'Recyclable',
    color: '#004B81',
    icon: recyclableIcon
  }
}

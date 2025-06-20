import { getPublicPath } from '@renderer/utils'
import React, { useEffect, useCallback } from 'react'

interface ChineseNumberSpeakerProps {
  texts: string[]
  onPlayEnd?: () => void // 可选的回调函数，当所有语音播放完毕时调用
}

const ChineseNumberSpeaker: React.FC<ChineseNumberSpeakerProps> = ({ texts, onPlayEnd }) => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  const playAudioAtIndex = useCallback(
    (index: number) => {
      if (index < texts.length) {
        const char = texts[index]
        const audioSrc = getPublicPath(`/assets/mp3/${char}.mp3`)

        if (!audioRef.current) {
          audioRef.current = new Audio()
        }
        audioRef.current.src = audioSrc
        audioRef.current.play().catch((error) => {
          console.error(`无法播放语音: ${audioSrc}`, error)
          // 如果某个字没有对应的语音文件，或者播放出错，则尝试播放下一个
          if (index + 1 < texts.length) {
            playAudioAtIndex(index + 1)
          } else {
            if (onPlayEnd) {
              onPlayEnd()
            }
          }
        })

        audioRef.current.onended = () => {
          if (index + 1 < texts.length) {
            playAudioAtIndex(index + 1)
          } else {
            if (onPlayEnd) {
              onPlayEnd()
            }
          }
        }
      } else {
        if (onPlayEnd) {
          onPlayEnd()
        }
      }
    },
    [texts, onPlayEnd]
  )

  useEffect(() => {
    playAudioAtIndex(0)
    // 清理函数，当组件卸载或 text 改变时停止当前播放
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.onended = null // 移除事件监听器
      }
    }
  }, [texts])

  return null
}

export default ChineseNumberSpeaker

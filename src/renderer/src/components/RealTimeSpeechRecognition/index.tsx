import { useState, useRef, useCallback, useMemo } from 'react'
import micAvif from './mic.avif'
import micSvg from './mic.svg'
import './index.css'
import { useDebounceEffect, useUnmount, useWebSocket } from 'ahooks'
import { AUDIO_APP_ID } from '@renderer/const'
import { generateUUID, identifyAllGarbage } from '@renderer/utils'
import askAudio from '@renderer/assets/mp3/ask.mp3'
import { Tooltip } from 'antd'
import { ReadyState } from 'ahooks/lib/useWebSocket'

interface IProps {
  token: string
  onIdentifySuccess?: (result: GarbageInfo[]) => void
}

const defaultMsg = { role: 'system', content: '请问，需要投递什么类型的垃圾', index: -1 }

const RealTimeSpeechRecognition = ({ token, onIdentifySuccess }: IProps) => {
  const [ready, readySet] = useState(false)
  const [active, activeSet] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const audioContextRef = useRef<AudioContext | null>(null)
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null)
  const audioInputRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const audioStreamRef = useRef<MediaStream | null>(null)
  const [messages, messagesSet] = useState([defaultMsg])
  const messagesListRef = useRef<HTMLDivElement | null>(null)

  const { sendMessage, disconnect, readyState, connect } = useWebSocket(
    `wss://nls-gateway.cn-shanghai.aliyuncs.com/ws/v1?token=${token}`,
    {
      reconnectInterval: 30 * 1000,
      onMessage(event) {
        const message = event?.data ? JSON.parse(event.data) : {}
        if (message.header?.name === 'TranscriptionStarted') {
          readySet(true)
          toggleRecording()
          return
        }
        const { payload } = message
        if (payload?.result) {
          const { result, index } = payload
          messagesSet((prev) => {
            const lastMessage = prev[prev.length - 1]
            if (lastMessage.role === 'assistant' && lastMessage.index === index) {
              lastMessage.content = result
              return [...prev]
            }
            return [...prev, { role: 'assistant', content: result, index }]
          })
          messagesListRef.current?.scrollTo(0, messagesListRef.current.scrollHeight)
        }
      },
      onOpen(_, instance) {
        const startTranscriptionMessage = {
          header: {
            appkey: AUDIO_APP_ID,
            namespace: 'SpeechTranscriber',
            name: 'StartTranscription',
            task_id: generateUUID(),
            message_id: generateUUID()
          },
          payload: {
            format: 'pcm',
            sample_rate: 16000,
            enable_intermediate_result: true,
            enable_punctuation_prediction: true,
            enable_inverse_text_normalization: true
          }
        }
        instance.send(JSON.stringify(startTranscriptionMessage))
      },
      onError(event) {
        console.log('🚀 ~ onError ~ event:', event)
        console.log('WebSocket连接发生错误')
        messagesSet([defaultMsg])
      },
      onClose(event) {
        console.log('🚀 ~ onClose ~ event:', event)
        console.log('WebSocket连接已关闭')
        messagesSet([defaultMsg])
      }
    }
  )

  const startRecording = useCallback(async () => {
    try {
      audioStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000
      })
      audioInputRef.current = audioContextRef.current.createMediaStreamSource(
        audioStreamRef.current
      )
      scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(2048, 1, 1)

      scriptProcessorRef.current.onaudioprocess = (event: AudioProcessingEvent) => {
        const inputData = event.inputBuffer.getChannelData(0)
        const inputData16 = new Int16Array(inputData.length)
        for (let i = 0; i < inputData.length; ++i) {
          inputData16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7fff // PCM 16-bit
        }
        sendMessage(inputData16.buffer)
      }

      audioInputRef.current.connect(scriptProcessorRef.current)
      scriptProcessorRef.current.connect(audioContextRef.current.destination)
    } catch (e) {
      console.log('🚀 ~ startRecording ~ e:', e)
    }
  }, [sendMessage])

  const stopRecording = () => {
    if (scriptProcessorRef.current && audioContextRef.current) {
      scriptProcessorRef.current.disconnect()
    }
    if (audioInputRef.current && audioContextRef.current) {
      audioInputRef.current.disconnect()
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop())
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
  }

  useUnmount(() => {
    stopRecording()
    disconnect()
  })

  const toggleRecording = useCallback(async () => {
    if (active) {
      messagesSet([defaultMsg])
      stopRecording()
    } else {
      setTimeout(() => {
        audioRef.current?.play()
      }, 300)
      startRecording()
    }
    activeSet(!active)
  }, [active, startRecording])

  useDebounceEffect(() => {
    const text = messages
      .slice(-5)
      .map((item) => item.content)
      .join('')
    const result = identifyAllGarbage(text)
    if (result.length) {
      toggleRecording()
      disconnect()
      onIdentifySuccess?.(result)
    }
  }, [messages])

  const messagesList = useMemo(() => {
    return messages.map((item, index) => {
      return (
        <div key={index} className="flex items-start mb-1">
          <div className="bg-[#f0f0f0] p-1 rounded-lg">
            <p className="text-sm text-gray-600">{item.content}</p>
          </div>
        </div>
      )
    })
  }, [messages])

  if (!ready) {
    return null
  }

  if (active) {
    return (
      <>
        <span
          onClick={toggleRecording}
          className="fixed z-10 cursor-pointer right-6 bottom-32 w-16 h-16 flex items-center justify-center bg-white rounded-full"
        >
          <div className="mic-btn-wave">
            <i className="outer-loop"></i>
            <i className="outer-loop auto-loop"></i>
            <i className="outer-loop auto-loop"></i>
          </div>
          <Tooltip
            title={
              <div className="max-h-64 overflow-auto" ref={messagesListRef}>
                {messagesList}
              </div>
            }
            open
          >
            <span className="bg-[#0070cc] w-12 h-12  flex items-center justify-center rounded-full z-30">
              <img src={micSvg} alt="mic" className="w-6 overflow-hidden" />
            </span>
          </Tooltip>
        </span>
        <audio src={askAudio} ref={audioRef}></audio>
      </>
    )
  }

  return (
    <>
      <span
        onClick={() => {
          if (readyState === ReadyState.Closed) {
            connect()
            return
          }
          toggleRecording()
        }}
        className="fixed z-20 cursor-pointer right-6 bottom-32 bg-white w-16 h-16 flex items-center justify-center overflow-hidden border-2 border-solid border-[#0070cc] rounded-full"
      >
        <img src={micAvif} alt="mic" className="w-6 overflow-hidden" />
      </span>
      <audio src={askAudio} ref={audioRef}></audio>
    </>
  )
}

export default RealTimeSpeechRecognition

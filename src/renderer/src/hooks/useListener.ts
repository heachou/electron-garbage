import { ISendMessageKey, ISendMessageToWindow } from '@/main/services'
import { useEffect, useRef } from 'react'

function useListener<T extends ISendMessageKey>(
  eventName: T,
  callback: (...args: Parameters<ISendMessageToWindow[T]>) => void
): void {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (window.electron && typeof window.electron.on === 'function') {
      const disposed = window.electron.on(eventName, callbackRef.current)

      return () => {
        if (typeof disposed === 'function') {
          disposed()
        }
      }
    } else {
      return () => {}
    }
  }, [eventName])
}

export default useListener

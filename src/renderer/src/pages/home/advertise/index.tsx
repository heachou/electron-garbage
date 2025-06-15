import { MEDIA_TYPE } from '@/main/data'
import { mediaDomain } from '@renderer/const'
import { callApi } from '@renderer/utils'
import { useRequest } from 'ahooks'
import { Carousel, Card } from 'antd'
import { useMemo } from 'react'
import leftIcon from '@renderer/assets/icons/left.png'
import rightIcon from '@renderer/assets/icons/right.png'

const Advertise = () => {
  const { data: medias } = useRequest(async () => callApi('getMediaList', {}), {
    cacheKey: 'getMediaList'
  })

  const carouselItems = useMemo(() => {
    if (!medias) return []
    return medias
      .filter((m) => m.location === MEDIA_TYPE.app_home_slider)?.[0]
      ?.filePath.map((path, index) => ({
        id: index,
        alt: path,
        imageUrl: `${mediaDomain}${path}`
      }))
  }, [medias])

  return (
    <div className="flex-1 min-h-0 flex items-center justify-center w-full px-3">
      <div className=" overflow-hidden p-2 flex min-h-0 h-full w-full items-center justify-center">
        <div className="w-full">
          <Carousel
            autoplay
            autoplaySpeed={10000}
            className="h-full"
            nextArrow={
              <div className="bg-white rounded-full p-2">
                <img src={rightIcon} className="w-6 h-6" />
              </div>
            }
            prevArrow={
              <div className="bg-white rounded-full p-2">
                <img src={leftIcon} className="w-6 h-6" />
              </div>
            }
          >
            {carouselItems.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded h-full items-center justify-center"
              >
                <img
                  src={item.imageUrl}
                  alt={item.alt}
                  className="w-auto h-full object-cover mx-auto"
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  )
}

export default Advertise

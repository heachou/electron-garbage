import request from '../utils/request'

/**
 * 查询媒体列表
 */
export const getMediaList = async (params: Record<string, unknown>): Promise<IMedia[]> => {
  const { data } = await request.get('/mini/api/media/list', {
    params
  })
  return data
}

// 获取垃圾分类
export const getGarbageKindList = async (url: string) => {
  const data = await request.get(`${import.meta.env.VITE_API_HOST}${url}`, {
    responseType: 'text'
  })
  return data
}

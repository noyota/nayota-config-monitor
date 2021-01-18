import requestData from '@/utils/data-server-request-v1'
import requestConfig from '@/utils/request-v1'
export function list(query) {
  if (process.env.VUE_APP_ROLE === 'serve') {
    return requestData({
      url: '/recalls',
      method: 'get',
      params: query
    })
  } else {
    return requestConfig({
      url: '/recalls',
      method: 'get',
      params: query
    })
  }
}

export function create(data) {
  if (process.env.VUE_APP_ROLE === 'serve') {
    return requestData({
      url: '/recalls',
      method: 'post',
      data
    })
  } else {
    return requestConfig({
      url: '/recalls',
      method: 'post',
      data })
  }
}

export function updateOne(data) {
  if (process.env.VUE_APP_ROLE === 'serve') {
    return requestData({
      url: `/recalls/${data._id}`,
      method: 'put',
      data
    })
  } else {
    return requestConfig({
      url: `/recalls/${data._id}`,
      method: 'put',
      data })
  }
}

export function deleteOne(id) {
  if (process.env.VUE_APP_ROLE === 'serve') {
    return requestData({
      url: `/recalls/${id}`,
      method: 'delete'
    })
  } else {
    return requestConfig({
      url: `/recalls/${id}`,
      method: 'delete' })
  }
}

export function deleteMany(ids) {
  if (process.env.VUE_APP_ROLE === 'serve') {
    return requestData({
      url: '/recalls',
      method: 'delete',
      data: ids // delete传递主体要包含在data里
    })
  } else {
    return requestConfig({
      url: '/recalls',
      method: 'delete',
      data: ids // delete传递主体要包含在data里
    })
  }
}

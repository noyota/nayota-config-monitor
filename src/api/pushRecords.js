import requestData from '@/utils/data-server-request-v1'
import requestConfig from '@/utils/request-v1'
export function list(query) {
  if (process.env.VUE_APP_ROLE === 'serve') {
    return requestData({
      url: '/push-records',
      method: 'get',
      params: query
    })
  } else {
    return requestConfig({
      url: '/push-records',
      method: 'get',
      timeout: 10000,
      params: query
    })
  }
}

export function create(data) {
  if (process.env.VUE_APP_ROLE === 'serve') {
    return requestData({
      url: '/push-records',
      method: 'post',
      data
    })
  } else {
    return requestConfig({
      url: '/push-records',
      method: 'post',
      data
    })
  }
}

export function updateOne(data) {
  if (process.env.VUE_APP_ROLE === 'serve') {
    return requestData({
      url: `/push-records/${data._id}`,
      method: 'put',
      data
    })
  } else {
    return requestConfig({
      url: `/push-records/${data._id}`,
      method: 'put',
      data
    })
  }
}

export function deleteOne(id) {
  if (process.env.VUE_APP_ROLE === 'serve') {
    return requestData({
      url: `/push-records/${id}`,
      method: 'delete'
    })
  } else {
    return requestConfig({
      url: `/push-records/${id}`,
      method: 'delete'
    })
  }
}

export function deleteMany(ids) {
  if (process.env.VUE_APP_ROLE === 'serve') {
    return requestData({
      url: '/push-records',
      method: 'delete',
      data: ids // delete传递主体要包含在data里
    })
  } else {
    return requestConfig({
      url: '/push-records',
      method: 'delete',
      data: ids // delete传递主体要包含在data里
    })
  }
}

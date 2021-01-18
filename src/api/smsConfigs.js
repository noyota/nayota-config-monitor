import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/smsConfigs',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/smsConfigs',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/smsConfigs/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/smsConfigs/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/smsConfigs',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

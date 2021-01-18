import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/thing-models',
    method: 'get',
    params: query
  })
}

export function getOne(id) {
  return request({
    url: `/thing-models/${id}`,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/thing-models',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/thing-models/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/thing-models/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/thing-models',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

export function install(data) {
  return request({
    url: '/thing-models/mqtt-client',
    method: 'post',
    timeout: 60000,
    data
  })
}

import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/mqtt-clients',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/mqtt-clients',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/mqtt-clients/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/mqtt-clients/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/mqtt-clients',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

export function initMqtt(id, query) {
  return request({
    url: `/mqtt-clients/init`,
    method: 'get',
    params: query
  })
}

export function getClientInfo(query) {
  return request({
    url: `/mqtt-clients/client-info`,
    method: 'get',
    params: query
  })
}

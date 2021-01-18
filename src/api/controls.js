import request from '@/utils/request-v1'
import requestServe from '@/utils/request-serve'

export function list(query) {
  return request({
    url: '/controls',
    method: 'get',
    params: query
  })
}

export function getOne(id) {
  return request({
    url: `/controls/${id}`,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/controls',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/controls/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/controls/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/controls',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}
export function tree(query) {
  return request({
    url: '/controls/tree',
    method: 'get',
    params: query
  })
}
export function getNewPi() {
  return requestServe({
    url: '/controls/newPi',
    method: 'get'
  })
}

export function updateSerialData(id, data) {
  return request({
    url: `/controls/${id}/serial-data`,
    method: 'put',
    data
  })
}

export function setMqttControl(data) {
  return request({
    url: `/controls/${data.id}/mqtt-client`,
    method: 'post',
    data
  })
}

export function setMaster(data) {
  return request({
    url: `/controls/${data.id}/master`,
    method: 'put',
    data
  })
}

export function mqttDownloadDatabase(query, id) {
  return request({
    url: `/controls/${id}/mqtt-download-database`,
    method: 'get',
    params: query,
    timeout: 10000
  })
}

export function initControl(query, id) {
  return request({
    url: `/controls/${id}/init-control`,
    method: 'get',
    params: query,
    timeout: 10000
  })
}

export function getControlOne() {
  return request({
    url: '/auth/controlone',
    method: 'get'
  })
}

export function read(_id, data) {
  return request({
    url: `/controls/${_id}/read`,
    method: 'put',
    data
  })
}

export function packageConfig(data) {
  return request({
    url: `/controls/${data._id}/package-config`,
    method: 'post',
    data
  })
}

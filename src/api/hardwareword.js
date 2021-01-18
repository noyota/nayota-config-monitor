import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/hardware-word',
    method: 'get',
    params: query
  })
}

export function getOne(id) {
  return request({
    url: `/hardware-word/${id}`,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/hardware-word',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/hardware-word/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/hardware-word/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/hardware-word',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}
// 下拉获取数据
export function select(query) {
  return request({
    url: '/hardware-word/select',
    method: 'get',
    params: query
  })
}

export function install(data) {
  return request({
    url: '/hardware-word/mqtt-client',
    method: 'post',
    timeout: 60000,
    data
  })
}
export function hardwareWordCode(query) {
  return request({
    url: '/hardware-word/hardwareWordCode',
    method: 'get',
    params: query
  })
}

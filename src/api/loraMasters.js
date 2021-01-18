import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/lora-masters',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/lora-masters',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/lora-masters/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/lora-masters/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/lora-masters',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}
export function tree(query) {
  return request({
    url: '/lora-masters/tree',
    method: 'get',
    params: query
  })
}
export function files(query) {
  return request({
    url: '/lora-masters/files',
    method: 'get',
    params: query
  })
}

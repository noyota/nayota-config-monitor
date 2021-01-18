import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/lora-slaves',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/lora-slaves',
    method: 'post',
    data
  })
}

export function getOne(id) {
  return request({
    url: '/lora-slaves/' + id,
    method: 'get'
  })
}

export function updateOne(data) {
  return request({
    url: `/lora-slaves/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/lora-slaves/${id}`,
    method: 'delete',
    timeout: 12000
  })
}

export function deleteMany(ids) {
  return request({
    url: '/lora-slaves',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

export function tree(query) {
  return request({
    url: '/lora-slaves/tree',
    method: 'get',
    params: query
  })
}

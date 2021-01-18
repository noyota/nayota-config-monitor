import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/operates',
    method: 'get',
    params: query
  })
}

export function getOne(id) {
  return request({
    url: `/operates/${id}`,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/operates',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/operates/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/operates/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/operates',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}
export function tree(query) {
  return request({
    url: '/operates/tree',
    method: 'get',
    params: query
  })
}

export function write(data) {
  return request({
    url: `/operates/${data._id}/write`,
    method: 'put',
    data
  })
}

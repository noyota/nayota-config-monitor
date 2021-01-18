import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/checks',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/checks',
    method: 'post',
    data
  })
}

export function getOne(id) {
  return request({
    url: `/checks/${id}`,
    method: 'get'
  })
}
export function updateOne(data) {
  return request({
    url: `/checks/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/checks/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/checks',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

export function tree(query) {
  return request({
    url: '/checks/tree',
    method: 'get',
    params: query
  })
}
export function test(query) {
  return request({
    url: '/checks/test',
    method: 'get',
    params: query
  })
}

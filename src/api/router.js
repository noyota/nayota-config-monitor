import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/routers',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/routers',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/routers/${data._id}`,
    method: 'put',
    data
  })
}

export function updateRoles(data) {
  return request({
    url: `/routers/roles-auth`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/routers/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/routers',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

export function generator(data) {
  return request({
    url: '/routers/generator',
    method: 'post',
    data
  })
}

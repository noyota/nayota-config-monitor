import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/agreement',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/agreement',
    method: 'post',
    data
  })
}

export function getOne(id) {
  return request({
    url: `/agreement/${id}`,
    method: 'get'
  })
}

export function updateOne(data) {
  return request({
    url: `/agreement/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/agreement/${id}`,
    method: 'delete'
  })``
}

export function deleteMany(ids) {
  return request({
    url: '/agreement',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

export function install(query) {
  return request({
    url: '/agreement/install',
    method: 'get',
    params: query,
    timeout: 30000
  })
}


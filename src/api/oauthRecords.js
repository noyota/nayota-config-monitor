import request from '@/utils/api-server-request-v1'

export function list(query) {
  return request({
    url: '/oauth-records',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/oauth-records',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/oauth-records/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/oauth-records/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/oauth-records',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

import request from '@/utils/data-server-request-v1'

export function list(query) {
  return request({
    url: '/check-reports',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/check-reports',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/check-reports/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/check-reports/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/check-reports',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

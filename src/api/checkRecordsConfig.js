import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/check-records',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/check-records',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/check-records/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/check-records/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/check-records',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

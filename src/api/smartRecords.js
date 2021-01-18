import request from '@/utils/data-server-request-v1'

export function list(query) {
  return request({
    url: '/smart-records',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/smart-records',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/smart-records/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/smart-records/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/smart-records',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

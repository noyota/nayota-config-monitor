import request from '@/utils/api-server-request-v1'

export function list(query) {
  return request({
    url: '/oauths',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/oauths',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/oauths/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/oauths/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/oauths',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

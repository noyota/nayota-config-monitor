import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/uploads',
    method: 'get',
    params: query
  })
}

export function getOne(id) {
  return request({
    url: `/uploads/${id}`,
    method: 'get'
  })
}

export function deleteOne(id) {
  return request({
    url: `/uploads/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/uploads',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

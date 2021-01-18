import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/ai-models',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/ai-models',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/ai-models/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/ai-models/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/ai-models',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

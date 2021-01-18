import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/scenes',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/scenes',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/scenes/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/scenes/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/scenes',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

export function tree(query) {
  return request({
    url: '/scenes/tree',
    method: 'get',
    params: query
  })
}

export function click(id) {
  return request({
    url: `/scenes/${id}/click`,
    method: 'get'
  })
}

export function timeJob(id, data) {
  return request({
    url: `/scenes/${id}/time`,
    method: 'put',
    data
  })
}


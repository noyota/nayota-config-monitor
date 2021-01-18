import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/updategits',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/updategits',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/updategits/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/updategits/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/updategits',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

export function current() {
  return request({
    url: '/updategits/current',
    method: 'get'
  })
}

export function pull(id) {
  return request({
    url: `/updategits/pull/${id}`,
    method: 'get'
  })
}

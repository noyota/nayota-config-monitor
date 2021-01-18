import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/things',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/things',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/things/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/things/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/things',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

export function write(data) {
  return request({
    url: `/things/${data._id}/write`,
    method: 'put',
    data
  })
}

export function thingStart(id) {
  return request({
    url: `/things/${id}/job`,
    method: 'get'
  })
}


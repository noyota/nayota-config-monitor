import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/persons',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/persons',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/persons/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/persons/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/persons',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

export function sendMany(data) {
  return request({
    url: '/persons/send',
    method: 'put',
    data
  })
}

import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/words',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/words',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/words/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/words/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/words',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

export function install(data) {
  return request({
    url: '/words/mqtt-client',
    method: 'post',
    data
  })
}

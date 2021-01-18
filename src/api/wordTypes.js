import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/word-types',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/word-types',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/word-types/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/word-types/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/word-types',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

export function iconLists(query) {
  return request({
    url: '/word-types/code',
    method: 'get',
    params: { wordType: query }
  })
}

import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/orderDatas',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/orderDatas',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/orderDatas/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/orderDatas/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/orderDatas',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

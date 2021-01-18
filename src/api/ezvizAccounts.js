import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/ezviz-accounts',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/ezviz-accounts',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/ezviz-accounts/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/ezviz-accounts/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/ezviz-accounts',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}
export function tree(query) {
  return request({
    url: '/ezviz-accounts/tree',
    method: 'get',
    params: query
  })
}

import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/hardwares',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/hardwares',
    method: 'post',
    data
  })
}

export function getOne(id) {
  return request({
    url: '/hardwares/' + id,
    method: 'get'
  })
}

export function updateOne(data) {
  return request({
    url: `/hardwares/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/hardwares/${id}`,
    method: 'delete',
    timeout: 12000
  })
}

export function deleteMany(ids) {
  return request({
    url: '/hardwares',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

export function tree(query) {
  return request({
    url: '/hardwares/tree',
    method: 'get',
    params: query
  })
}

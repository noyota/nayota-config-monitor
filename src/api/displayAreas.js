import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/display-areas',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/display-areas',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/display-areas/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/display-areas/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/display-areas',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}
export function tree(query) {
  return request({
    url: '/display-areas/tree',
    method: 'get',
    params: query
  })
}
export function boardAreaList(query) {
  return request({
    url: '/display-areas/board-area-list',
    method: 'get',
    params: query
  })
}

// 同步
export function install(data) {
  return request({
    url: '/display-areas/mqtt-client',
    method: 'post',
    data
  })
}

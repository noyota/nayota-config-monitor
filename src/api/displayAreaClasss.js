import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/display-area-classs',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/display-area-classs',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/display-area-classs/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/display-area-classs/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/display-area-classs',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

// 同步
export function install(data) {
  return request({
    url: '/display-area-classs/mqtt-client',
    method: 'post',
    data
  })
}

import request from '@/utils/api-server-request-v1'

export function getInfo() {
  return request({
    url: '/old-users/info',
    method: 'get'
  })
}

export function list(query) {
  return request({
    url: '/old-users',
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: '/old-users',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: `/old-users/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/old-users/${id}`,
    method: 'delete'
  })
}

export function deleteUsers(ids) {
  return request({
    url: '/old-users',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}


import request from '@/utils/request-v1'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}
export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}
export function reglogin(data) {
  return request({
    url: '/auth/reglogin',
    method: 'post',
    data
  })
}
export function activateControl(data) {
  return request({
    url: '/auth/activateControl',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/users/info',
    method: 'get'
  })
}
export function check(query) {
  return request({
    url: '/users/check',
    method: 'get',
    params: query
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function list(query) {
  return request({
    url: '/users',
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: `/users/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

export function deleteUsers(ids) {
  return request({
    url: '/users',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

export function select() {
  return request({
    url: '/users/select',
    method: 'get'
  })
}
export function tree(query) {
  return request({
    url: '/users/tree',
    method: 'get',
    params: query
  })
}


import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/ui-models',
    method: 'get',
    params: query
  })
}

export function getOne(id) {
  return request({
    url: '/ui-models/' + id,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/ui-models',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/ui-models/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/ui-models/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/ui-models',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}
// // 同步
// export function install(data) {
//   return request({
//     url: '/ui-managements/mqtt-client',
//     method: 'post',
//     data
//   })
// }

import request from '@/utils/data-server-request-v1'

export function list(query) {
  return request({
    url: '/abnormal-datas',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/abnormal-datas',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/abnormal-datas/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: `/abnormal-datas/${id}`,
    method: 'delete'
  })
}

export function deleteMany(ids) {
  return request({
    url: '/abnormal-datas',
    method: 'delete',
    data: ids // delete传递主体要包含在data里
  })
}

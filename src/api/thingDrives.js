import request from '@/utils/request-v1'

export function list(query) {
  return request({
    url: '/thing-drives',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/thing-drives',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: `/thing-drives/${data._id}`,
    method: 'put',
    data
  })
}

export function deleteOne(id, thingmodelid) {
  return request({
    url: `/thing-drives/${id}`,
    method: 'delete',
    data: { id: id, thingmodelid: thingmodelid }
  })
}

export function deleteMany(ids, thingmodelid) {
  return request({
    url: '/thing-drives',
    method: 'delete',
    data: { ids: ids, thingmodelid: thingmodelid } // delete传递主体要包含在data里
  })
}

export function getselecttreelist(query) {
  return request({
    url: '/thing-drives/tree-lists',
    method: 'get',
    params: query

  })
}

export function getDefaultChecks(query) {
  return request({
    url: '/thing-drives/default-checks',
    method: 'get',
    params: { query: query }

  })
}

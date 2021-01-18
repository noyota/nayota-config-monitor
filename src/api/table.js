import request from '@/utils/request-example'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

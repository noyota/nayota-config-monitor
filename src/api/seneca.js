import request from '@/utils/request-serve'

export function getMqttRoleList() {
  return request({
    url: '/seneca/mqtt-roles',
    method: 'get'
  })
}

export function mqttUserUniqueness(query) {
  return request({
    url: '/seneca/mqtt-users/uniqueness',
    method: 'get',
    params: query
  })
}

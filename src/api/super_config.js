/**
 * @author lifeng
 * @date 19-10-21
 * @Description: 一些对系统环境做修改的超级操作
*/
import request from '@/utils/request-super'

/**
 * 获取系统时间
 */
export function getTime(data) {
  return request({
    url: '/time',
    method: 'get',
    data
  })
}

/**
 * 设置系统时间
 */
export function setTime(data) {
  return request({
    url: '/time',
    method: 'post',
    data
  })
}

/**
 * 重启系统
 */
export function reboot() {
  return request({
    url: '/reboot',
    method: 'get'
  })
}

/**
 * 重启docker
 */
export function restart() {
  return request({
    url: '/restart',
    method: 'get',
    timeout: 15000
  })
}

/**
 * 获取当前IP
 * @param query 网络类型
 */
export function get_ip(query) {
  return request({
    url: '/ip',
    method: 'get',
    params: query
  })
}

export function get_static_ip(query) {
  return request({
    url: '/static-ip',
    method: 'get',
    params: query
  })
}

/**
 * 设置树莓派IP
 * @param data
 */
export function set_ip(data) {
  return request({
    url: '/static-ip',
    method: 'post',
    data
  })
}

export function get_ap(data) {
  return request({
    url: '/ap',
    method: 'get',
    data
  })
}

export function set_ap(data) {
  return request({
    url: '/ap',
    method: 'post',
    data
  })
}

export function start_ap(query) {
  return request({
    url: '/ap/start',
    method: 'get',
    params: query
  })
}

export function restart_ap() {
  return request({
    url: '/ap/restart',
    method: 'get'
  })
}

export function enable_ap(query) {
  return request({
    url: '/ap/enable',
    method: 'get',
    params: query
  })
}


const acl = require('acl')
const ctrl = require('../controllers/router.controller')

class Policies {
  constructor() {
    this.acl = new acl(new acl.memoryBackend()) // eslint-disable-line new-cap
  }

  async init() {
    this.routers = await ctrl.list({ type: 'api', lean: true })
    this.mapRouters = new Map()
    this.routers.forEach(router => {
      router.roles = router.roles.map(role => role.toString())
      this.acl.allow(router.roles, router.path, router.method)
      this.mapRouters.set(router.path + '-' + router.method, router)
    })
  }

  hasCheck(path, method) {
    return this.mapRouters.has(path + '-' + method)
  }

  isAllowed(roles, resource, permissions, callback) {
    try {
      roles = roles.map(role => {
        if (role.name === 'admin') {
          throw new Error('admin is super administrator')
        }
        return role._id.toString()
      })
      this.acl.areAnyRolesAllowed(roles, resource, permissions, callback)
    } catch (e) {
      callback(null, true)
    }
  }
}

module.exports = Policies

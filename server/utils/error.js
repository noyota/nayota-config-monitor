class ServerError extends Error {
  constructor(serverCode, message) {
    super(message)
    this.serverCode = serverCode
  }
}

module.exports = ServerError

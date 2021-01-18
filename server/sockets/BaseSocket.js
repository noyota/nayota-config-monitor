class BaseSocket {
  setIo(io) {
    this.io = io
  }
  getIo() {
    return this.io
  }
  socketListener(io, socket) {
  }
}

module.exports = BaseSocket

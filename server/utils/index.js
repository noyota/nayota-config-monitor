// recall 编码
exports.createRecall = function() {
  return Date.now().toString(16).slice(-6) + Math.random().toString(16).slice(-2)
}

/**
 * 休眠
 * @param time
 * @return {Promise}
 */
exports.sleep = function(time) {
  return new Promise(res => {
    setTimeout(res, time)
  })
}

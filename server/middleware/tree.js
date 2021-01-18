module.exports = {
  createTree,
  createSelectTree
}

async function createTree(data, query) {
  const pos = {}
  const tree = []
  let i = 0
  let j = 1
  const fieldName = query.fieldName ? query.fieldName : null
  const allName = query.allName ? query.allName : '所有'
  while (data.length !== 0) {
    if (data[i].father == null) {
      data[i].children = []
      if (fieldName != null && data[i][fieldName] !== undefined) {
        data[i].label = data[i][fieldName]
      } else {
        data[i].label = data[i].name
      }
      tree.push(data[i])
      pos[data[i]._id] = [tree.length - 1]
      data.splice(i, 1)
      i--
    } else if (data[i].level < j) {
      const posArr = pos[data[i].father]
      if (posArr !== undefined) {
        let obj = tree[posArr[0]]
        for (let m = 1; m < posArr.length; m++) {
          obj = obj.children[posArr[m]]
        }
        data[i].children = []
        if (fieldName != null && data[i][fieldName] !== undefined) {
          data[i].label = data[i][fieldName]
        } else {
          data[i].label = data[i].name
        }
        obj.children.push(data[i])
        pos[data[i]._id] = posArr.concat([obj.children.length - 1])
        data.splice(i, 1)
        i--
      } else {
        data.splice(i, 1)
      }
    }
    i++
    if (i > data.length - 1) {
      j++
      i = 0
    }
  }
  const alltree = []
  alltree.push({ label: allName, children: tree })
  return alltree
}

async function createSelectTree(data, query) {
  const pos = {}
  const tree = []
  let i = 0
  let j = 1
  const fieldName = query.fieldName ? query.fieldName : null
  while (data.length !== 0) {
    if (data[i].father == null) {
      data[i].children = []
      if (fieldName != null && data[i][fieldName] !== undefined) {
        data[i].label = data[i][fieldName]
      } else {
        data[i].label = data[i].name
      }
      data[i].value = data[i]._id
      tree.push(data[i])
      pos[data[i]._id] = [tree.length - 1]
      data.splice(i, 1)
      i--
    } else if (data[i].level < j) {
      const posArr = pos[data[i].father]
      if (posArr !== undefined) {
        let obj = tree[posArr[0]]
        for (let m = 1; m < posArr.length; m++) {
          obj = obj.children[posArr[m]]
        }
        data[i].children = []
        if (fieldName != null && data[i][fieldName] !== undefined) {
          data[i].label = data[i][fieldName]
        } else {
          data[i].label = data[i].name
        }
        data[i].value = data[i]._id
        obj.children.push(data[i])
        pos[data[i]._id] = posArr.concat([obj.children.length - 1])
        data.splice(i, 1)
        i--
      }
    }
    i++
    if (i > data.length - 1) {
      j++
      i = 0
    }
  }
  return tree
}

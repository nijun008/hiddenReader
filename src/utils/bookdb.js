const Nedb = require('nedb')

const { remote } = require('electron')

const path = require('path')

let cachePath = path.dirname(remote.app.getPath('cache'))

class Db {
  constructor (database) {
    this.db = new Nedb({
      filename: database,
      autoload: true
    })
  }

  find (query) {
    return new Promise((resolve, reject) => {
      this.db.find(query, (err, result) => {
        if (err) {
          console.log('查询数据库出错！', err)
          reject(err)
        } else {
          console.log('查询结果:', result)
          resolve(result)
        }
      })
    })
  }

  insert (values) {
    return new Promise((resolve, reject) => {
      this.db.insert(values, (err, result) => {
        if (err) {
          console.log('插入数据出错！', err)
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  update (query, newDoc) {
    return new Promise((resolve, reject) => {
      this.db.update(query, newDoc, function (err, result) {
        if (err) {
          console.log('更新数据出错！', err)
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  remove (query) {
    return new Promise((resolve, reject) => {
      this.db.remove(query, {}, (err, numRemoved) => {
        if (err) {
          console.log('数据删除出错', err)
          reject(err)
        } else {
          resolve(numRemoved)
        }
      })
    })
  }
}

export default new Db(cachePath + '/hiddenReader/books.db')

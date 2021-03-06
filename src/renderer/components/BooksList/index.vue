<template>
  <div class="page-wrap">
    <div class="books-wrap">
      <div class="books-box">

        <div class="book"
          v-for="(book, index) in books" 
          :key="'book-' + index" 
          @mouseenter="() => bookHoverHandle(book, true)"
          @mouseleave="() => bookHoverHandle(book, false)"
          @click="bookClickHandle(book)">
          <div class="book-title">{{ book.name }}</div>
          <div class="progress">{{ book.progress*100 + '%' }}</div>
          <div v-show="book === hoverBook" class="remove-button" @click.stop="removeBookHandle(book, index)">-</div>
        </div>
        <div class="book" @click="openFileHandle">
          <div class="add">+</div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
// If not already defined...
import { mapActions } from 'vuex'
const { remote } = require('electron')

const { dialog } = remote
const fs = require('fs')
const jschardet = require('jschardet')
const iconv = require('iconv-lite')

let chaperRegStr = '第[0-9一二三四五六七八九十百千万]+'
let allUnits = '[章卷节回幕计]'

export default {
  data () {
    return {
      hoverBook: {}
    }
  },
  computed: {
    books () {
      return this.$store.state.Book.booksList
    }
  },
  methods: {
    ...mapActions({
      removeBook: 'removeBook',
      addBook: 'addBook'
    }),
    bookClickHandle ({ _id }) {
      this.$router.push({
        path: '/book',
        query: {
          bookId: _id
        }
      })
    },
    getBookList () {
      this.booksdb.find({}, (err, books) => {
        if (!err) {
          this.books = books
        } else {
          console.log('查询本地数据出错：', err)
        }
      })
    },
    bookHoverHandle (book, val) {
      this.hoverBook = val ? book : {}
    },
    removeBookHandle (book, index) {
      let flag = confirm('是否要删除书籍？')
      if (flag) {
        // this.booksdb.remove({ _id: book._id }, {}, (err, numRemoved) => {
        //   if (err) {
        //     console.log('数据删除失败：', err)
        //   } else {
        //     console.log('删除数据成功，删除数量：' + numRemoved)
        //     this.books.splice(index, 1)
        //   }
        // })
        // console.log(this.removeBook)
        this.removeBook(book, index).then(() => {
          console.log('成功')
        }).catch(err => {
          console.log(err)
        })
      }
    },
    openFileHandle () {
      let files = dialog.showOpenDialogSync({
        filters: [
          { name: '文本文档', extensions: ['txt'] },
          { name: '所有文件', extensions: ['*'] }
        ],
        properties: ['openFile']
      })

      console.time('bookHandle')

      if (files && files[0]) {
        let filePath = files[0]
        if (this.books.find(book => book.filePath === filePath)) {
          alert('书籍已在书架中')
          return
        }

        let fileName = filePath.split('\\')[filePath.split('\\').length - 1]

        let extension = fileName.split('.')[fileName.split('.').length - 1]

        let name = fileName.split('.')
        name.splice(-1, 1)
        name = name.join('')

        let fileStr = fs.readFileSync(filePath)

        let txtData = ''

        if (jschardet.detect(fileStr).encoding === 'UTF-8') {
          txtData = fs.readFileSync(filePath, 'utf8')
        } else {
          txtData = iconv.decode(fileStr, 'gbk')
        }

        let book = {
          filePath,
          fileName,
          extension,
          name,
          progress: 0,
          currentChaper: 0,
          chaperContentProg: 0
        }

        txtData && (book.chapers = this.chaperSplitUntree(txtData, book.name))

        console.log(book)
        console.timeEnd('bookHandle')

        this.addBook(book)
      }
    },
    chaperSplit (title, content, level, parent) {
      let reg = new RegExp(chaperRegStr + allUnits, 'g')

      let mathchArr = content.match(reg)
      if (mathchArr) {
        let units = mathchArr[0][mathchArr[0].length - 1]
        let unitsReg = new RegExp(chaperRegStr + units, 'g')
        let unitsMathchArr = content.match(unitsReg)

        let contentArr = content.split(unitsReg)

        if (contentArr.length > unitsMathchArr.length) {
          contentArr.splice(0, 1)
        }
        parent.catalogue = unitsMathchArr
        parent.chapters = []
        unitsMathchArr.forEach((item, index) => {
          parent.chapters.push({
            units,
            title: title + ' ' + item,
            content: contentArr[index] || '',
            level: level + 1
          })
        })

        parent.content = ''

        parent.chapters.forEach(item => {
          this.chaperSplit(item.title, item.content, level, item)
        })
      }
    },
    // 章节分割
    chaperSplitUntree (content, title) {
      let reg = new RegExp(chaperRegStr + allUnits, 'g')

      let mathchArr = content.match(reg)

      let contentArr = []
      let chapers = []

      if (mathchArr) {
        contentArr = content.split(reg)

        if (contentArr[0]) {
          mathchArr.splice(0, 0, title)
        } else {
          contentArr.splice(0, 1)
        }

        mathchArr.forEach((chapersTitle, index) => {
          chapers.push({
            index,
            title: chapersTitle,
            content: chapersTitle + contentArr[index],
            length: (chapersTitle + contentArr[index]).length
          })
        })

        return chapers
      } else {
        return [{
          index: 0,
          title: title,
          content: content,
          length: content.length
        }]
      }
    }
  }
}
</script>

<style scoped>
.books-wrap {
  padding: 20px 10px;
  background-color: #fefefe;
  font-size: 14px;
}
.books-box {
  display: flex;
  flex-wrap: wrap;
}
.book {
  height: 151px;
  width: 120px;
  cursor: pointer;
  box-shadow: 5px 5px 5px #8d8d8d;
  border: 1px solid #ededed;
  letter-spacing: 1px;
  margin: 10px;
  position: relative;
}
.book-title {
  padding: 6px;
  height: 130px;
  line-height: 24px;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  overflow: hidden;
}
.progress {
  text-align: center;
  color: #7d7d7d;
  font-size: 12px;
  padding-bottom: 4px;
}
.add {
  line-height: 130px;
  font-size: 40px;
  color: #3c4f63;
  text-align: center;
  font-weight: 500;
}
.remove-button {
  cursor: pointer;
  position: absolute;
  background-color: #e65c22;
  color: #fff;
  width: 18px;
  height: 18px;
  line-height: 14px;
  text-align: center;
  top: -6px;
  right: -6px;
  border-radius: 50%;
  font-size: 24px;
}
</style>
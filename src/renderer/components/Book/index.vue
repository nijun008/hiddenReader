<template>
  <div class="book-page">

    <div class="cat-bar" :class="{ 'show': catShow }">
      <div class="cat-btn" @click="toggleBar('catShow')">
        <div class="btn-icon" :class="{ 'left': catShow }">></div>
      </div>
      <ul>
        <li class="cat-item current-cat">目录一</li>
        <li class="cat-item">目录二 lhkjhjkhlkhiulklklkd寄快递；诶都了看家点击后第六空间</li>
        <li class="cat-item">目录三</li>
        <li class="cat-item">目录四</li>
      </ul>
    </div>

    <div class="set-bar" :class="{ 'show': setShow }">
      <ul>
        <li v-for="(val, key) in setStyle" :key="key" class="set-item">
          <label>{{ key }}:</label><input v-model="setStyle[key]">
        </li>
      </ul>
      <div class="set-btn" @click="toggleBar('setShow')">
        <div class="btn-icon" :class="{ 'left': setShow }">{{ '<' }}</div>
      </div>
    </div>

    <div class="content" @click="toggleAll" :style="setStyle">
      这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容
      这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容
      这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容
      这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容
      这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容
    </div>
  </div>
</template>

<script>
import bookdb from '@/../utils/bookdb'
export default {
  data () {
    return {
      catShow: false,
      setShow: false,
      bookId: '',
      book: {},
      setStyle: {
        color: '#333',
        backgroundColor: '#fff',
        fontSize: '14px',
        lineHeight: '26px'
      }
    }
  },
  created () {
    this.bookId = this.$route.query.bookId
    this.loadBook()
  },
  methods: {
    toggleAll () {
      this.setShow = false
      this.catShow = false
    },
    toggleBar (type) {
      this[type] = !this[type]
    },
    loadBook () {
      if (!this.bookId) {
        this.loadFailHandle()
        return
      }
      bookdb.find({ _id: this.bookId }).then(res => {
        if (res && res.length > 0) {
          this.book = res[0]
          console.log(this.book)
          return
        }
        this.loadFailHandle()
      }).catch(() => {
        this.loadFailHandle()
      })
    },
    loadFailHandle () {
      alert('书籍不存在！')
      this.$router.replace('/bookslist')
    }
  }
}
</script>

<style scoped>
.book-page {
  height: 100%;
  position: relative;
  overflow: hidden;
}
.cat-bar {
  height: 100%;
  position: absolute;
  top: 0;
  left: -300px;
  width: 300px;
  background-color: #eee;
  transition: left .4s;
}
.set-bar {
  font-size: 14px;
  line-height: 40px;
  width: 250px;
  height: 100%;
  position: absolute;
  top: 0;
  right: -250px;
  background-color: #eee;
  transition: right .4s;
  z-index: 10;
}
.set-bar.show {
  right: 0;
}
.cat-bar.show{
  left: 0;
}
.cat-btn {
  position: absolute;
  width: 20px;
  right: -20px;
  cursor: pointer;
  top: 40%;
}
.set-btn {
  position: absolute;
  width: 20px;
  left: -20px;
  cursor: pointer;
  top: 40%;
}
.btn-icon {
  transition: transform .2s;
}
.btn-icon.left {
  transform: rotate(180deg);
}
.cat-item {
  cursor: pointer;
  border-bottom: 1px solid #dfdfdf;
  padding: 8px 10px 8px 20px;
  font-size: 14px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.current-cat {
  color: red;
}
.cat-item:hover {
  background-color: #ddd;
}
.set-item label{
  display: inline-block;
  width: 140px;
  padding-right: 10px;
  text-align: right;
}
.set-item input{
  width: 70px;
  height: 30px;
  padding-left: 5px;
  border: none;
  outline: none;
}
.content {
  width: 100%;
  height: 100%;
}
</style>
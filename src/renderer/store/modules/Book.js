import Vue from 'vue'
import bookdb from '../../../utils/bookdb'

const state = {
  booksList: []
}

const mutations = {
  SET_BOOK (state, booksList) {
    state.booksList = booksList || []
  },
  ADD_BOOK (state, book) {
    state.booksList.push(book)
  },
  REMOVE_BOOK (state, target) {
    state.booksList = state.booksList.filter(book => book._id !== target._id)
  },
  UPDATE_BOOK (state, book) {
    let index = state.booksList.find(item => item._id === book._id)
    Vue.set(state.booksList, index, book)
  }
}

const actions = {
  initBook ({ commit }) {
    bookdb.find({}).then(booksList => {
      commit('SET_BOOK', booksList)
    })
  },
  addBook ({ commit }, book) {
    return new Promise((resolve, reject) => {
      bookdb.insert(book).then(newBook => {
        commit('ADD_BOOK', newBook)
        resolve(newBook)
      }).catch(err => {
        reject(err)
      })
    })
  },
  removeBook ({ commit }, book, bookIndex) {
    return new Promise((resolve, reject) => {
      bookdb.remove({_id: book._id}).then((removeNum) => {
        commit('REMOVE_BOOK', book)
        resolve(removeNum)
      }).catch(err => {
        reject(err)
      })
    })
  },
  updateBook ({ commit }, book) {
    return new Promise((resolve, reject) => {
      bookdb.update({ _id: book._id }, book).then((removeNum) => {
        commit('UPDATE_BOOK', book)
        resolve(removeNum)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  state,
  mutations,
  actions
}

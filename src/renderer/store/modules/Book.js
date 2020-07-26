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
  REMOVE_BOOK (state, bookIndex) {
    state.booksList.splice(bookIndex, 1)
  },
  UPDATE_BOOK (state, bookIndex, book) {
    Vue.$set(state.booksList, bookIndex, book)
  }
}

const actions = {
  initBook ({ commit }) {
    console.log('分发actions')
    bookdb.find({}).then(booksList => {
      console.log('find结果:', booksList)
      commit('SET_BOOK', booksList)
    })
  },
  addBook ({ commit }, book) {
    commit('ADD_BOOK', book)
  },
  removeBook ({ commit }, bookIndex) {
    commit('REMOVE_BOOK', bookIndex)
  },
  updateBook ({ commit }, bookIndex, book) {
    commit('UPDATE_BOOK', bookIndex, book)
  }
}

export default {
  state,
  mutations,
  actions
}

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'layout',
      component: require('@/components/Layout').default,
      children: [
        {
          path: '/home',
          name: 'home',
          component: require('@/components/Home').default
        },
        {
          path: '/bookslist',
          name: 'bookslist',
          component: require('@/components/BooksList').default
        },
        {
          path: '/book',
          name: 'book',
          component: require('@/components/Book').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

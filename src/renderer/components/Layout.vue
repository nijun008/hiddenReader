<template>
  <div class="layout-wrap">

    <button 
      v-for="meun in menuList"
      :key="meun.path"
      class="button" 
      :class="{ 'active': $route.path === meun.path }" 
      @click="toPage(meun.path)"
      >
      {{ meun.title }}
    </button>

    <div class="layout-main">
      <router-view></router-view>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      menuList: [
        { title: 'Home', path: '/home' },
        { title: '书架', path: '/bookslist' },
        { title: '书籍', path: '/book' }
      ]
    }
  },
  created () {
    this.$store.dispatch('initBook')
  },
  methods: {
    toPage (path) {
      path !== this.$route.path && this.$router.push(path)
    }
  }
}
</script>

<style>

</style>
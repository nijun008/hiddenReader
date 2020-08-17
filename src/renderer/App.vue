<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'hidden-reader'
  }
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
ul, ol {
  list-style: none;
}
html, body {
  height: 100%;
  color: #2c3e50;
}
#app {
  height: 100%;
}
.button {
  font-size: 14px;
  cursor: pointer;
  outline: none;
  line-height: 22px;
  padding: 6px 16px;
  border-radius: 20px;
  display: inline-block;
  color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
  background: transparent;
}
.button+.button {
  margin-left: 10px;
}
.button.active {
  background-color: #4fc08d;
  color: #fff;
}
</style>

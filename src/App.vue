<template>
  <div id="app" class="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      //
    };
  }
};
</script>

<style>
@import "./styles/index.css";
</style>

<style lang="scss" scoped>
@import "./styles/App.scss";
</style>

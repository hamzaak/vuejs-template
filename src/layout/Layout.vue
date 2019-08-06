<template>
  <div id="layout" class="layout">
    <navbar />
    <Content />
  </div>
</template>

<script>
import Navbar from "./Navbar";
import Content from "./Content";

export default {
  name: "layout",
  components: {
    Navbar,
    Content
  },
  data() {
    return {
      //
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/Layout.scss";
</style>

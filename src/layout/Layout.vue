<template>
  <div id="layout" class="layout">
    <navbar />
    <Content />
  </div>
</template>

<script>
import Navbar from "@/layout/Navbar";
import Content from "@/layout/Content";

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

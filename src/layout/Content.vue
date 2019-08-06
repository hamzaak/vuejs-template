<template>
  <el-row :gutter="20" class="layout-content">
    <el-col :span="20" :offset="2">
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/LayoutContent.scss";
</style>

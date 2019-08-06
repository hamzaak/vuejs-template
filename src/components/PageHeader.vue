<template>
  <div>
    <div slot="header" class="clearfix">
      <el-tooltip effect="dark" content="Go back" placement="bottom" v-if="onBack">
        <i class="el-icon-back card-header-back-button" @click="onBack()" />
      </el-tooltip>
      <span class="card-header-title">
        <el-divider direction="vertical" v-if="onBack"></el-divider>
        <slot name="left"></slot>
      </span>
      <div class="card-header-buttons">
        <slot name="right"></slot>
      </div>
    </div>
    <el-divider></el-divider>
  </div>
</template>

<script>
export default {
  name: "page-header",
  props: {
    onBack: Function
  }
};
</script>
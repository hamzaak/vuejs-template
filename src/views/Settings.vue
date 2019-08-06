<template>
  <el-card class="box-card">
    <el-tabs v-model="activeTab" @tab-click="_onTabClick">
      <el-tab-pane label="Accounts" name="accounts">
        <account-list />
      </el-tab-pane>
      <el-tab-pane label="Currencies" name="currencies">
        <currency-list />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import AccountList from "./account/AccountList";
import CurrencyList from "./currency/CurrencyList";

export default {
  name: "settings",
  components: {
    AccountList,
    CurrencyList
  },
  data() {
    return {
      activeTab: "accounts"
    };
  },
  methods: {
    _onTabClick(tab, event) {
      this.$router.push(`/settings/${tab.name}`);
    }
  },
  mounted() {
    const routeName = this.$router.currentRoute.name;
    if (routeName.includes('-accounts')) {
      this.activeTab = "accounts";
    }
    if (routeName.includes('-currencies')) {
      this.activeTab = "currencies";
    }
  }
};
</script>
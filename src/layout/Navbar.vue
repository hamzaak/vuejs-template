<template>
  <el-row :gutter="20" class="navbar">
    <el-col :span="20">
      <el-menu :default-active="currentRoute" mode="horizontal" text-color="#303133">
        <el-menu-item index="ponente" disabled class="el-menu-item-logo">Ponente</el-menu-item>
        <el-menu-item index="summary" @click="_onRedirect('/summary')">Summary</el-menu-item>
        <el-submenu index="account">
          <template slot="title">Accounts</template>
          <el-submenu v-for="(directory, directoryKey) in directories" :key="directoryKey" :index="`transaction-${directory.id}`">
            <template slot="title">{{ directory.name }}</template>
            <el-menu-item
              v-for="(account, accountKey) in accounts.filter(x => x.directoryId == directory.id)" :key="accountKey"
              :index="`transactions-${directory.id}-${account.id}`"
              :to="{ name: 'transaction', params: { accountId: account.id } }"
              @click="_onAccountItemClick(account.id)">
              {{ `${account.name} (${account.currency.name})` }}
            </el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="settings" @click="_onRedirect('/settings')">Settings</el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
import * as ACTION from "../store/constants/actions";
import * as MODULE from "../store/constants/modules";
import DirectoriesApi from "../api/directoriesApi";
import AccountsApi from "../api/accountsApi";

export default {
  name: "navbar",
  data() {
    return {
      currentRoute: null
    };
  },
  computed: {
    directories() {
      return this.$store.state.directoryModule.all;
    },
    accounts() {
      return this.$store.state.accountModule.all;
    }
  },
  methods: {
    _onRedirect(to) {
      this.$router.push(to);
    },
    _onAccountItemClick(accountId) {
      this.$router.push({ name: "transactions", params: { accountId: accountId } });
    },
    getCurrentRoute() {
      this.currentRoute = this.$router.currentRoute.name;
      if (this.currentRoute.includes("transactions")) {
        const account = this.accounts[0];
        this.currentRoute = `transactions-${account.directoryId}-${account.id}`;
      }

      if (this.currentRoute.includes("settings")) {
        const account = this.accounts[0];
        this.currentRoute = 'settings';
      }
    }
  },
  mounted() {
    DirectoriesApi.getAll()
      .then(res => {
        this.$store.dispatch(`${MODULE.DIRECTORY}/${ACTION.DIRECTORY_SET}`, res);
      })
      .catch(err => {console.log(err)});
    AccountsApi.getAll()
      .then(res => {
        this.$store.dispatch(`${MODULE.ACCOUNT}/${ACTION.ACCOUNT_SET}`, res);
        this.getCurrentRoute();
      })
      .catch(err => console.log(err));
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/LayoutNavbar.scss";
</style>

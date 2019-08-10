<template>
  <div>
    <el-table v-loading="table.loading" :data="getTableData" row-key="id" :show-header="false">
      <el-table-column prop="name" label="" />
      <el-table-column align="right">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.type == 0 ? $t('updateDirectory'): $t('updateAccount')" placement="left">
            <el-button type="warning" size="mini" plain @click="_onUpdateLinkClick(scope.row.id, scope.row.type)">
              <v-icon name="pencil-alt" />
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" :content="scope.row.type == 0 ? $t('deleteDirectory'): $t('deleteAccount')" placement="right">
            <el-button type="danger" size="mini" plain :loading="deleting" @click="_onDeleteLinkClick(scope.row.id, scope.row.type)">
              <v-icon name="trash-alt" />
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="top-margin-10">
      <el-button type="primary" @click="_onRedirect('/settings/directories/create')" size="mini" plain round>
        <i class="el-icon-plus" /> {{$t('createDirectory')}}
      </el-button>
      <el-button type="primary" @click="_onRedirect('/settings/accounts/create')" size="mini" plain round>
        <i class="el-icon-plus" /> {{$t('createAccount')}}
      </el-button>
    </div>
  </div>
</template>

<script>
import * as ACTION from "@/store/constants/actions";
import * as MODULE from "@/store/constants/modules";
import DirectoriesApi from "@/api/directoriesApi";
import AccountsApi from "@/api/accountsApi";

export default {
  name: "account-list",
  data() {
    return {
      table: {
        data: [],
        loading: false
      },
      deleting: false
    };
  },
  computed: {
    accounts() {
      return this.$store.state.accountModule.all;
    },
    directories() {
      return this.$store.state.directoryModule.all;
    },
    getTableData() {
      const options = [];
      const _directories = this.$store.state.directoryModule.all;
      const _accounts = this.$store.state.accountModule.all;
      _directories.forEach(function (directory) {
        let item = {
          id: `directory-${directory.id}`,
          name: directory.name,
          type: 0,
          children: []
        };
        _accounts.filter(x => x.directoryId == directory.id).forEach(function (account) {
          item.children.push(
            {
              id: account.id,
              type: 1,
              name: `${account.name} (${account.currency.name})` 
            });
        });
        options.push(item);
      });
      return options;
    }
  },
  methods: {
    _onRedirect(to) {
      this.$router.push(to);
    },
    _onUpdateLinkClick(id, type) {
      const to = type == 0
        ? `/settings/directories/update/${parseInt(id.split('-')[1])}`
        : `/settings/accounts/update/${parseInt(id)}`;
      this.$router.push(to);
    },
    _onDeleteLinkClick(id, type) {
      type == 0 ? this._onDeleteDirectory(id.split('-')[1]) : this._onDeleteAccount(id);
    },
    _onDeleteDirectory(id) {
      const hasAccounts = this.accounts.some(x => x.directoryId == id);
      if (hasAccounts) {
        this.$message({
          type: "warning",
          message: this.$t('deleteDirectoryWarningMsg'),
          duration: 0,
          showClose: true
        });
        return;
      }
      this.$confirm(this.$t('deleteDirectoryConfirmMsg'), this.$t('deleteDirectoryConfirmTitle'), {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel'),
          type: "warning"
        }).then(() => {
          this.deleting = true;
          DirectoriesApi.delete(id)
            .then(res => {
              this.deleting = false;
              this.$message({ type: "success", message: this.$t('deleteDirectoryCompletedMsg') });
              this.$store.dispatch(`${MODULE.DIRECTORY}/${ACTION.DIRECTORY_DELETE}`, id);
            })
            .catch(err => {
              this.deleting = false;
              this.$message({ message: err, type: "error", duration: 0, showClose: true });
            });
        });
    },
    _onDeleteAccount(id) {
      this.$confirm(this.$t('deleteAccountConfirmMsg'), this.$t('deleteAccountConfirmTitle'), {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel'),
          type: "warning"
        }).then(() => {
          this.deleting = true;
          AccountsApi.delete(id)
            .then(res => {
              this.deleting = false;
              this.$message({ type: "success", message: this.$t('deleteAccountCompletedMsg') });
              this.$store.dispatch(`${MODULE.ACCOUNT}/${ACTION.ACCOUNT_DELETE}`, id);
            })
            .catch(err => {
              this.deleting = false;
              this.$message({ message: err, type: "error", duration: 0, showClose: true });
            });
        });
    },
    load() {

    }
  },
  created() {
    this.load();
  }  
};
</script>
<template>
  <div>
    <el-table v-loading="table.loading" :data="table.data">
      <el-table-column prop="name" :label="$t('currency')" />
      <el-table-column prop="value" :label="$t('value')"/>      
      <el-table-column align="right">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="$t('update')" placement="left">
            <el-button type="warning" size="mini" plain @click="_onRedirect(`/settings/currencies/update/${scope.row.id}`)">
              <v-icon name="pencil-alt" />
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" :content="$t('delete')" placement="right">
            <el-button type="danger" size="mini" plain :loading="deleting" @click="_onItemDelete(scope.row.id)">
              <v-icon name="trash-alt" />
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="top-margin-10">
      <el-button type="primary" @click="_onRedirect('/settings/currencies/create')" size="mini" plain round>
        <i class="el-icon-plus" /> {{$t('createCurrency')}}
      </el-button>
    </div>
  </div>
</template>

<script>
import CurrenciesApi from "@/api/currenciesApi";
import { currency } from "@/utils/object-utils";

export default {
  name: "currency-list",
  data() {
    return {
      table: {
        data: [],
        loading: false
      },
      deleting: false
    };
  },
  methods: {
    _onRedirect(to) {
      this.$router.push(to);
    },
    _onItemDelete(id) {
      this.$confirm(this.$t('deleteCurrencyConfirmMsg'), this.$t('deleteCurrencyConfirmTitle'), {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel'),
          type: "warning"
        }).then(() => {
          this.deleting = true;
          CurrenciesApi.delete(id)
            .then(res => {
              this.deleting = false;
              this.$message({ type: "success", message: this.$t('deleteCurrencyCompletedMsg') });
              this.load();
            })
            .catch(err => {
              this.deleting = false;
              this.$message({ message: err, type: "error", duration: 0, showClose: true });
            });
        });
    },
    currencyFormatter (row, column) {
      return currency(row.amount);
    },
    load() {
      this.table.loading = true;
      CurrenciesApi.getAll()
        .then(res => {
          this.table.loading = false;
          this.table.data = res;
        })
        .catch(err => {
          this.table.loading = false;
          this.$message({ message: err, type: "error", duration: 0, showClose: true });
        });
    }
  },
  created() {
    this.load();
  }  
};
</script>
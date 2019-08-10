<template>
  <el-card class="box-card">
    <page-header>
      <template v-slot:left v-if="account">
        {{ account.directory.name }}
        <i class="el-icon-arrow-right"></i>
        {{ `${account.name} (${account.currency.name})` }}
      </template>
      <template v-slot:right>
        <el-tooltip effect="dark" :content="$t('createTransaction')" placement="bottom">
          <el-button type="primary" size="mini" plain @click="_onRedirect(`/transactions/create/${filters.accountId}`)">
            <v-icon name="plus" />
          </el-button>
        </el-tooltip>
        <el-tooltip effect="dark" :content="$t('transfer')" placement="bottom">
          <el-button type="primary" size="mini" plain @click="_onRedirect(`/transactions/transfer/${filters.accountId}`)">
            <v-icon name="exchange-alt" />
          </el-button>
        </el-tooltip>
        <el-tooltip effect="dark" :content="filters.open == 0 ? $t('openFilters') : $t('closeFilters')" placement="bottom">
          <el-button type="primary" size="mini" :plain="filters.open == 0" @click="_toggleFilters()">
            <v-icon name="filter" />
          </el-button>
        </el-tooltip>
      </template>
    </page-header>
    <el-collapse v-model="filters.open" @click="_toggleFilters">
      <el-collapse-item :name="1">
        <template slot="title">
          <span :style="filters.open == 0 ? 'color:#606266;':'color:#409eff;'">{{$t('filters')}}</span>
        </template>
        <el-form :model="filters" label-width="120px" label-position="left" class="no-top-margin">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item :label="$t('dateRange')">
                <el-date-picker
                  v-model="filters.date" type="daterange" :range-separator="$t('dateRangeSeperator')" :start-placeholder="$t('dateRangeStartPh')" :end-placeholder="$t('dateRangeEndPh')"
                  :clearable="false" :editable="false" format="dd.MM.yyyy" value-format="yyyy-MM-dd" class="block"
                />
              </el-form-item>
              <el-form-item :label="$t('amountRange')">
                <el-col :span="11" style="padding-left:0;padding-right:0;">
                  <el-form-item>
                    <el-input-number v-model="filters.amount[0]" controls-position="right" class="block" />
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11" style="padding-left:0;padding-right:0;">
                  <el-form-item>
                    <el-input-number v-model="filters.amount[1]" controls-position="right" class="block" />
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('type')" prop="type">
                <el-select v-model="filters.type" class="block">
                  <el-option :label="$t('typeOptAll')" :value="0" />
                  <el-option :label="$t('typeOptIncome')" :value="1" />
                  <el-option :label="$t('typeOptExpense')" :value="2" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('description')">
                <el-input v-model="filters.description" :placeholder="$t('descriptionSearchInPh')" />
              </el-form-item>
            </el-col>
          </el-row>
          <div style="text-align:right;">
            <el-button @click="_onResetFilters" size="mini" round>{{$t('reset')}}</el-button>
            <el-button type="primary" @click="_onApplyFilters" size="mini" round>{{$t('apply')}}</el-button>
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-table v-loading="table.loading" :data="table.data" :row-class-name="_rowClass">
      <el-table-column :label="$t('date')" prop="date" :formatter="_dateFormatter"  width="120" />
      <el-table-column :label="$t('amount')" width="120" :formatter="_currencyFormatter"/>
      <el-table-column :label="$t('description')" prop="description" />
      <el-table-column align="right">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="$t('update')" placement="left">
            <el-button type="warning" size="mini" plain @click="_onRedirect(`/transactions/update/${scope.row.id}`)">
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
    <el-pagination
      background
      layout="total, prev, pager, next, jumper"
      :total="table.total"
      :hide-on-single-page="table.total <= table.pageSize"
      @current-change="_onTableCurrentChange"
    />
  </el-card>
</template>

<script>
import moment from "moment";
import AccountsApi from "@/api/accountsApi";
import TransactionsApi from "@/api/transactionsApi";
import PageHeader from "@/components/PageHeader";
import { currency } from "@/utils/object-utils";

const now = new Date();
const beforeMonth = new Date();
beforeMonth.setMonth(now.getMonth() - 1);

export default {
  name: "transaction-list",
  components: {
    PageHeader
  },
  data() {
    return {
      account: null,
      transactions: [],
      filters: {
        open: 0,
        accountId: 0,
        date: [beforeMonth.toISOString().slice(0, 10), now.toISOString().slice(0, 10)],
        amount: [0, 100000],
        type: 0,
        description: ""
      },
      table: {
        data: [],
        loading: false,
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      deleting: false
    };
  },
  methods: {
    _onRedirect(to) {
      this.$router.push(to);
    },
    _onItemDelete(id) {
      this.$confirm(this.$t('deleteTransactionConfirmMsg'), this.$t('deleteTransactionConfirmTitle'), {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel'),
          type: "warning"
        }).then(() => {
          this.deleting = true;
          TransactionsApi.delete(id)
            .then(res => {
              this.deleting = false;
              this.$message({ type: "success", message: this.$t('deleteTransactionCompletedMsg') });
              this.load();
            })
            .catch(err => {
              this.deleting = false;
              this.$message({ message: err, type: "error", duration: 0, showClose: true });
            });
        });
    },
    _onTableCurrentChange(currentPage) {
      this.table.currentPage = currentPage;
      this.getTransactions();
    },
    _toggleFilters() {
      this.filters.open = this.filters.open == 0 ? 1 : 0;
    },
    _onResetFilters() {
      this.filters.date = [beforeMonth.toISOString().slice(0, 10), now.toISOString().slice(0, 10)];
      this.filters.amount = [0, 100000];
      this.filters.type = 0;
      this.filters.description = "";
    },
    _onApplyFilters() {
      this.getTransactions();
    },
    _rowClass({row, rowIndex}) {
      if (row.type !== 1) {
        return "danger-row";
      }
      return "";
    },
    _dateFormatter (row, column) {
        var date = row[column.property];
        if (date == undefined) {
            return "";
        }
        return moment(date).format("YYYY.MM.DD");
    },
    _currencyFormatter(row, column) {
      return currency(row.amount);
    },
    load() {
      this.filters.accountId = this.$route.params.accountId;
      this.getAccount();
      this.getTransactions();
    },
    getAccount() {
      AccountsApi.get(this.filters.accountId)
        .then(res => {
          this.account = res;
        })
        .catch(err => console.log(err));
    },
    getTransactions() {
      this.table.loading = true;
      const query = {
        accountId: this.filters.accountId,
        date: this.filters.date,
        amount: this.filters.amount,
        type: this.filters.type,
        description: this.filters.description,
        pageSize: this.table.pageSize,
        currentPage: this.table.currentPage
      };

      TransactionsApi.getAll(JSON.stringify(query))
        .then(res => {
          this.table.data = res.transactions;
          this.table.total = res.total || 0;
          this.table.loading = false;
        })
        .catch(err => {
          this.table.loading = false;
          this.$message({ message: err, type: "error", duration: 0, showClose: true });
        });
    }
  },
  watch: {
    "$route.params.accountId": function (accountId) {
      this.load();
    }
  },
  created() {
    this.load();
  }  
};
</script>

<template>
  <div id="summary">
    <el-row :gutter="24">
      <el-col :span="12" :offset="6">
        <el-form :model="filters" style="text-align:center;">
          <el-form-item label="">
            <el-date-picker
              v-model="filters.date" type="daterange" :range-separator="$t('dateRangeSeperator')" :start-placeholder="$t('dateRangeStartPh')" :end-placeholder="$t('dateRangeEndPh')"
              :clearable="false" :editable="false" format="dd.MM.yyyy" value-format="yyyy-MM-dd" class="block"
              @change="loadCharts()"
            />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="top-margin-10">
      <el-col :span="12">
        <el-card class="box-card no-min-width">
          <page-header>
            <template v-slot:left>{{ $t('chartTransactions') }}</template>
          </page-header>
          <apexchart type=bar height="200px" :options="transactionsOptions" :series="transactionsSeries" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card no-min-width">
          <page-header>
            <template v-slot:left>{{ $t('chartAccountQuantityDistribution') }}</template>
          </page-header>
          <apexchart type=pie :options="accountSumsOptions" :series="accountSumsSeries" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="top-margin-10">
       <el-col :span="12">
        <el-card class="box-card no-min-width">
          <page-header>
            <template v-slot:left>{{ $t('accounts') }}</template>
          </page-header>
          <el-table v-loading="accountsTable.loading" :data="accountsTable.data" :show-header="false">
            <el-table-column :label="$t('accountName')" prop="account" />
            <el-table-column :label="$t('sum')" prop="sum" width="120" :formatter="_currencyFormatter"/>
            <el-table-column align="right" width="60">
              <template slot-scope="scope">
                <el-tooltip effect="dark" :content="$t('view')" placement="left">
                  <el-button type="primary" size="mini" plain @click="_onAccountItemClick(scope.row.accountId)">
                    <v-icon name="arrow-right" />
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card no-min-width">
          <page-header>
            <template v-slot:left>{{ $t('chartOverallChange') }}</template>
          </page-header>
          <apexchart type=area height="300px" :options="overallChangeOptions" :series="overallChangeSeries" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TransactionsApi from "@/api/transactionsApi";
import PageHeader from "@/components/PageHeader";
import { currency } from "@/utils/object-utils";

const now = new Date();
const beforeMonth = new Date();
beforeMonth.setMonth(now.getMonth() - 3);

export default {
  data: function() {
    return {
      filters: {
        date: [beforeMonth.toISOString().slice(0, 10), now.toISOString().slice(0, 10)]
      },
      accountsTable: {
        data: [],
        loading: true
      },
      overallChangeSeries: [{
        name: this.$t('amount'),
        data: []
      }],
      overallChangeOptions: {
        chart: {
          zoom: { enabled: false },
          toolbar: { show: false } 
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 1,
          curve: 'smooth'
        },
        labels: [],
        xaxis: {
          type: 'datetime',
        },
        yaxis: {
          opposite: true
        },
        legend: {
          horizontalAlign: 'left'
        }
      },
      transactionsSeries: [{
        name: this.$t('amount'),
        data: []
      }],
      transactionsOptions: {
        chart: {
          zoom: { enabled: false },
          toolbar: { show: false } 
        },
        plotOptions: {
          bar: {
            colors: {
              ranges: [
                { from: -1000000, to: 0, color: '#f56c6c'},
                { from: 0, to: 1000000, color: '#67c23a'}
              ]
            },
            columnWidth: '100%',
          }
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          type: 'datetime',
          categories: [],
          labels: {
            rotate: -90
          }
        }
      },
      accountSumsSeries: [],
      accountSumsOptions: {
        labels: []
      }
    }
  },
  components: {
    PageHeader
  },
  methods: {
    _onAccountItemClick(accountId) {
      this.$router.push({ name: "transactions", params: { accountId: accountId } });
    },
    _dateFormatter (row, column) {
        var date = row[column.property];
        if (date == undefined) {
            return "";
        }
        return moment(date).format("YYYY.MM.DD");
    },
    _currencyFormatter(row, column) {
      return currency(row.sum);
    },
    loadCharts() {
      console.log('asdasd');
      this.accountsTable.loading = true;
      let query = JSON.stringify({
        date: this.filters.date
      });

      TransactionsApi.getSumsByAccount()
        .then(res => {
          this.accountSumsSeries = res.map(x => x.sum);
          this.accountSumsOptions = {
            labels: res.map(x => `${x.account.directory.name} > ${x.account.name} (${x.account.currency.name})`)
          };
        })
        .catch(err => {
          this.$message({ message: err, type: "error", duration: 0, showClose: true });
        });

      TransactionsApi.getSumsByDate()
        .then(res => {
          this.overallChangeSeries = [{ data: res.map(x => x.total) }];
          this.overallChangeOptions = { labels: [] };
          this.overallChangeOptions.labels = res.map(x => x.date);
        })
        .catch(err => {
          this.$message({ message: err, type: "error", duration: 0, showClose: true });
        });

      TransactionsApi.getTransactionReport(query)
        .then(res => {
          this.transactionsSeries = [{ data: res.map(x => x.sum) }];
          this.transactionsOptions = { xaxis: { categories: [] } };
          this.transactionsOptions.xaxis.categories = res.map(x => x.date);
        })
        .catch(err => {
          this.$message({ message: err, type: "error", duration: 0, showClose: true });
        });

      TransactionsApi.getAccountsReport()
        .then(res => {
          this.accountsTable.data = res;
          this.accountsTable.loading = false;
        })
        .catch(err => {
          this.$message({ message: err, type: "error", duration: 0, showClose: true });
        });
    }
  },
  mounted() {
    this.loadCharts();
  }
};
</script>

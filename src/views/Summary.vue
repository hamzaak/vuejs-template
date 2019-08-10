<template>
  <div id="summary">
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card class="box-card no-min-width">
          <page-header>
            <template v-slot:left>{{ $t('chartTransactions') }}</template>
          </page-header>
          <apexchart type=bar height="200px" :options="transactionsOptions" :series="transactionsSeries" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="top-margin-10">
      <el-col :span="12">
        <el-card class="box-card no-min-width">
          <page-header>
            <template v-slot:left>{{ $t('chartAccountQuantityDistribution') }}</template>
          </page-header>
          <apexchart type=pie :options="accountSumsOptions" :series="accountSumsSeries" />
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

export default {
  data: function() {
    return {
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
        labels: [],
        theme: {
          monochrome: {
            enabled: true
          }
        }
      }
    }
  },
  components: {
    PageHeader
  },
  mounted() {
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

        this.transactionsSeries = [{ data: res.map(x => x.sum) }];
        this.transactionsOptions = { xaxis: { categories: [] } };
        this.transactionsOptions.xaxis.categories = res.map(x => x.date);
      })
      .catch(err => {
        this.$message({ message: err, type: "error", duration: 0, showClose: true });
      });
  }
};
</script>

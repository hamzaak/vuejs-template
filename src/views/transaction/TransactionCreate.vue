<template>
  <el-card class="box-card">
    <page-header :onBack="_onCancel">
      <template v-slot:left>{{$t('createTransaction')}}</template>
      <template v-slot:right>
        <el-tooltip effect="dark" :content="$t('save')" placement="bottom">
          <el-button type="primary" size="mini" :loading="form.loading" plain @click="_onSave()">
            <v-icon name="check" />
          </el-button>
        </el-tooltip>
        <el-tooltip effect="dark" :content="$t('cancel')" placement="bottom">
          <el-button type="danger" size="mini" plain @click="_onCancel()">
            <v-icon name="times" />
          </el-button>
        </el-tooltip>
      </template>
    </page-header>
    <el-form :model="form" :ref="form.name" :rules="rules" label-width="120px" label-position="left">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item :label="$t('account')">
            <el-cascader v-model="form.accountId" :options="accountSelectOptions" class="block" />
          </el-form-item>
          <el-form-item :label="$t('type')">
            <el-select v-model="form.type" class="block">
              <el-option :label="$t('typeOptIncome')" :value="1" />
              <el-option :label="$t('typeOptExpense')" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('date')">
            <el-date-picker
              type="date" :clearable="false" :editable="false" v-model="form.date"
              format="dd.MM.yyyy" value-format="yyyy-MM-dd" class="block"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('amount')">
            <el-input-number v-model="form.amount" controls-position="right" class="block"/>
          </el-form-item>
          <el-form-item :label="$t('description')" prop="description">
            <el-input type="textarea" v-model="form.description" class="block"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import TransactionsApi from "@/api/transactionsApi";
import PageHeader from "@/components/PageHeader";

export default {
  name: "transaction-create",
  components: {
    PageHeader
  },
  data() {
    return {
      form: {
        name: "entity-form",
        accountId: ["0", 0],
        type: 1,
        date: new Date().toISOString().slice(0, 10),
        amount: 100,
        description: "",
        loading: false
      },
      rules: {
          amount: [
            { required: true, message: this.$t('amountRequiredMsg'), trigger: 'blur' }
          ],
          description: [
            { required: true, message: this.$t('descriptionRequiredMsg'), trigger: 'blur' },
            { min: 5, message: this.$t('descriptionRequiredMinMsg'), trigger: 'blur' }
          ]
        }
    };
  },
  computed: {
    accounts() {
      return this.$store.state.accountModule.all;
    },
    directories() {
      return this.$store.state.directoryModule.all;
    },
    accountSelectOptions() {
      const options = [];
      const _directories = this.$store.state.directoryModule.all;
      const _accounts = this.$store.state.accountModule.all;
      _directories.forEach(function (directory) {
        let item = {
          value: `directory-${directory.id}`,
          label: directory.name,
          children: []
        };
        _accounts.filter(x => x.directoryId == directory.id).forEach(function (account) {
          item.children.push({ value: account.id, label: `${account.name} (${account.currency.name})` });
        });
        options.push(item);
      });
      return options;
    }
  },
  methods: {
    _onSave() {
      this.$refs[this.form.name].validate((valid) => {
        if (!valid) {
          return false;
        } 
        this.form.loading = true;
        const transaction = {
          accountId: parseInt(this.form.accountId[1]),
          date: this.form.date,
          amount: this.form.amount,
          type: this.form.type,
          description: this.form.description
        };
        TransactionsApi.add(transaction)
          .then(() => {
            this.form.loading = false;
            this.$message({ message: this.$t('createTransactionSuccessMsg'), type: "success" });
          })
          .catch(err => {
            this.form.loading = false;
            this.$message({ message: err, type: "error", duration: 0, showClose: true });
          });
      });
    },
    _onCancel() {
      this.$router.back();
    }
  },
  mounted() {
    const prmAccountId = parseInt(this.$route.params.accountId);
    const acc = this.accounts.filter(x => x.id === prmAccountId)[0];
    if(acc) {
      this.form.accountId = [`directory-${acc.directoryId}`, acc.id];
    }
  }
};
</script>

<template>
  <el-card class="box-card">
    <page-header :onBack="_onCancel">
      <template v-slot:left>Tranfer</template>
      <template v-slot:right>
        <el-tooltip effect="dark" content="Save" placement="bottom">
          <el-button type="primary" size="mini" :loading="form.loading" plain @click="_onSave()">
            <v-icon name="check" />
          </el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="Cancel" placement="bottom">
          <el-button type="danger" size="mini" plain @click="_onCancel()">
            <v-icon name="times" />
          </el-button>
        </el-tooltip>
      </template>
    </page-header>
    <el-form :model="form" :ref="form.name" :rules="rules" label-width="120px" label-position="left">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-divider content-position="left">From Details</el-divider>     
          <el-form-item label="Account" class="top-margin-20">
            <el-cascader v-model="form.fromAccountId" :options="this.form.accountOptions" class="block" @change="_onFromAccountChange"/>
          </el-form-item>
          <el-form-item label="Amount">
            <el-input-number v-model="form.fromAmount" controls-position="right" class="block"  @change="_onFromAmountChange"/>
          </el-form-item>
          <el-form-item label="Currency Value" >
            <el-input-number v-model="form.fromAccount.currency.value" controls-position="right" class="block" :disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-divider content-position="left">To Details</el-divider> 
          <el-form-item label="Account" class="top-margin-20">
            <el-cascader v-model="form.toAccountId" :options="this.form.accountOptions" class="block" @change="_onToAccountChange"/>
          </el-form-item>
          <el-form-item label="Amount" >
            <el-input-number v-model="form.toAmount" controls-position="right" class="block" :disabled="true"/>
          </el-form-item>
          <el-form-item label="Currency Value" >
            <el-input-number v-model="form.toAccount.currency.value" controls-position="right" class="block" :disabled="true"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">Common Details</el-divider>
      <el-row :gutter="24" class="top-margin-20">
        <el-col :span="12">
           <el-form-item label="Date">
            <el-date-picker
              v-model="form.date" type="date" :clearable="false" :editable="false"
              format="dd.MM.yyyy" value-format="yyyy-MM-dd" class="block"
            />
          </el-form-item>
           <el-form-item label="Commission">
            <el-input-number v-model="form.commission" controls-position="right" class="block"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Description" prop="description">
            <el-input type="textarea" v-model="form.description" class="block"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import AccountsApi from "@/api/accountsApi";
import TransactionsApi from "@/api/transactionsApi";
import PageHeader from "@/components/PageHeader";

export default {
  name: "transaction-transfer",
  components: {
    PageHeader
  },
  data() {
    return {
      form: {
        name: "entity-form",
        accountOptions: [],
        fromAccount: {
          currency: {
            value: 1
          }
        },
        fromAccountId: ["0", 0],
        fromAmount: 0,
        toAccount: {
          currency: {
            value: 1
          }
        },
        toAccountId: ["0", 0],
        toAmount: 0,
        date: new Date().toISOString().slice(0, 10),
        commission: 0,
        description: "",
        loading: false
      },
      rules: {
          amount: [{ required: true, message: 'Please input amount', trigger: 'blur' }],
          description: [
            { required: true, message: 'Please input description', trigger: 'blur' },
            { min: 5, message: 'Description min length should be 5', trigger: 'blur' }
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
    }
  },
  methods: {
    _onSave() {
      this.$refs[this.form.name].validate((valid) => {
        if (!valid) {
          return false;
        } 
        this.form.loading = true;
        const dto = {
          fromAccountId: parseInt(this.form.fromAccountId[1]),
          toAccountId: parseInt(this.form.toAccountId[1]),
          amount: this.form.fromAmount,
          commission: this.form.commission,
          date: this.form.date,
          description: this.form.description
        };
        TransactionsApi.transfer(dto)
          .then(() => {
            this.form.loading = false;
            this.$message({ message: "Money transfer has been done successfuly.", type: "success" });
          })
          .catch(err => {
            this.form.loading = false;
            this.$message({ message: err, type: "error", duration: 0, showClose: true });
          });
      });
    },
    _onCancel() {
      this.$router.back();
    },
    _onFromAccountChange(value) {
      const accountId = value[1];
      AccountsApi.get(accountId)
        .then(res => {
          this.form.fromAccount = res;
        }).catch(err => console.log(err));
    },
    _onToAccountChange(value) {
      const accountId = value[1];
      AccountsApi.get(accountId)
        .then(res => {
          this.form.toAccount = res;
        }).catch(err => console.log(err));
    },
    _onFromAmountChange(value) {
      this.form.fromAmount = value ? value: 0;
      this.form.toAmount = this.form.fromAmount * this.form.fromAccount.currency.value / this.form.toAccount.currency.value;
    },
    createAccountOptions() {
      const options = [];
      const _directories = this.directories;
      const _accounts = this.accounts;
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

      this.form.accountOptions = options;
    }
  },
  mounted() {
    this.createAccountOptions();

    const prmAccountId = parseInt(this.$route.params.accountId);
    const acc = this.accounts.filter(x => x.id === prmAccountId)[0];
    if(acc) {
      this.form.fromAccountId = [`directory-${acc.directoryId}`, acc.id];
    }

    AccountsApi.get(prmAccountId)
      .then(res => {
        this.form.fromAccount = res;
      }).catch(err => console.log(err));
  }
};
</script>

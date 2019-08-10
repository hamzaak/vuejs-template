<template>
  <el-card class="box-card">
    <page-header :onBack="_onCancel">
      <template v-slot:left>{{$t('updateAccount')}}</template>
      <template v-slot:right>
        <el-tooltip effect="dark" :content="$t('update')" placement="bottom">
          <el-button type="warning" size="mini" :loading="form.loading" plain @click="_onUpdate()">
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
          <el-form-item :label="$t('directory')">
            <el-select v-model="form.directoryId" :clearable="false" :editable="false" class="block">
              <el-option v-for="item in form.directories" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('currency')">
            <el-select v-model="form.currencyId" :clearable="false" :editable="false" class="block">
              <el-option v-for="item in form.currencies" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('description')" prop="description">
            <el-input type="textarea" v-model="form.description" class="block"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('accountName')">
            <el-input :placeholder="$t('accountName')" v-model="form.accountName" class="block"></el-input>
          </el-form-item>
          <el-form-item :label="$t('type')">
            <el-select v-model="form.type" class="block">
              <el-option :label="$t('typeOptIncome')" :value="1" />
              <el-option :label="$t('typeOptExpense')" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import * as ACTION from "@/store/constants/actions";
import * as MODULE from "@/store/constants/modules";
import CurrenciesApi from "@/api/currenciesApi";
import DirectoriesApi from "@/api/directoriesApi";
import AccountsApi from "@/api/accountsApi";
import PageHeader from "@/components/PageHeader";

export default {
  name: "account-update",
  components: {
    PageHeader
  },
  data() {
    return {
      form: {
        name: "entity-form",
        id: this.$route.params.id,
        directories: [],
        directoryId: 0,
        accountName: "",
        currencies: [],
        currencyId: 0,
        type: 1,
        description: "",
        loading: false
      },
      rules: {
          accountName: [
            { required: true, message: this.$t('accountNameRequiredMsg'), trigger: 'blur' },
            { min: 3, message: this.$t('accountNameRequiredMinMsg'), trigger: 'blur' }
          ],
          description: [
            { required: true, message: this.$t('descriptionRequiredMsg'), trigger: 'blur' },
            { min: 5, message: this.$t('descriptionRequiredMinMsg'), trigger: 'blur' }
          ]
        }
    };
  },
  methods: {
    _onUpdate() {
      this.$refs[this.form.name].validate((valid) => {
        if (!valid) {
          return false;
        } 
        this.form.loading = true;
        const account = {
            id: parseInt(this.form.id),
            directoryId: this.form.directoryId,
            currencyId: this.form.currencyId,
            name: this.form.accountName,
            type: this.form.type,
            description: this.form.description
        };
        AccountsApi.update(account)
          .then((res) => {
            this.form.loading = false;
            this.$message({ message: this.$t('updateAccountSuccessMsg'), type: "success" });
            this.$store.dispatch(`${MODULE.ACCOUNT}/${ACTION.ACCOUNT_UPDATE}`, res);
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
    getAccount() {
      AccountsApi.get(this.form.id)
        .then(item => {
          this.form.directoryId = item.directoryId;
          this.form.currencyId = item.currencyId;
          this.form.type = item.type;
          this.form.accountName = item.name;
          this.form.description = item.description;
        })
        .catch(err => console.log(err));
    }
  },
  mounted() {
    CurrenciesApi.getAll()
      .then(res => {
        this.form.currencies = res;
        this.form.currencyId = this.form.currencies[0].id;
      })
      .catch(err => console.log(err));

    DirectoriesApi.getAll()
      .then(res => {
        this.form.directories = res;
        this.form.directoryId = this.form.directories[0].id;
      })
      .catch(err => console.log(err));
    
    this.getAccount();
  }
};
</script>

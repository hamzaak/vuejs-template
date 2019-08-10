<template>
  <el-card class="box-card">
    <page-header :onBack="_onCancel">
      <template v-slot:left>{{$t('createCurrency')}}</template>
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
          <el-form-item :label="$t('currencyName')">
            <el-input :placeholder="$t('currencyName')" v-model="form.currencyName" class="block"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item :label="$t('currencyValue')">
                <el-input-number v-model="form.currencyValue" controls-position="right" class="block"/>
            </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import CurrenciesApi from "@/api/currenciesApi";
import PageHeader from "@/components/PageHeader";

export default {
  name: "directory-create",
  components: {
    PageHeader
  },
  data() {
    return {
      form: {
        name: "entity-form",
        currencyName: "",
        currencyValue: 0,
        loading: false
      },
      rules: {
          currencyName: [
            { required: true, message: this.$t('currencyNameRequiredMsg'), trigger: 'blur' }
          ],
          currencyValue: [
            { required: true, message: this.$t('currencyValueRequiredMsg'), trigger: 'blur' }
          ]
        }
    };
  },
  methods: {
    _onSave() {
      this.$refs[this.form.name].validate((valid) => {
        if (!valid) {
          return false;
        } 
        this.form.loading = true;
        const currency = {
          name: this.form.currencyName,
          value: this.form.currencyValue
        };
        CurrenciesApi.add(currency)
          .then((res) => {
            this.form.loading = false;
            this.$message({ message: this.$t('createCurrencySuccessMsg'), type: "success" });
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
  }
};
</script>

<template>
  <el-card class="box-card">
    <page-header :onBack="_onCancel">
      <template v-slot:left>{{$t('updateDirectory')}}</template>
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
          <el-form-item :label="$t('directoryName')">
            <el-input :placeholder="$t('directoryName')" v-model="form.directoryName" class="block"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import * as ACTION from "@/store/constants/actions";
import * as MODULE from "@/store/constants/modules";
import DirectoriesApi from "@/api/directoriesApi";
import PageHeader from "@/components/PageHeader";

export default {
  name: "directory-update",
  components: {
    PageHeader
  },
  data() {
    return {
      form: {
        name: "entity-form",
        id: this.$route.params.id,
        directoryName: "",
        loading: false
      },
      rules: {
          directoryName: [
            { required: true, message: this.$t('directoryNameRequiredMsg'), trigger: 'blur' },
            { min: 3, message: this.$t('directoryNameRequiredMinMsg'), trigger: 'blur' }
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
        const directory = {
            id: parseInt(this.form.id),
            name: this.form.directoryName
        };
        DirectoriesApi.update(directory)
          .then((res) => {
            console.log(res)
            this.form.loading = false;
            this.$message({ message: this.$t('updateDirectorySuccessMsg'), type: "success" });
            this.$store.dispatch(`${MODULE.DIRECTORY}/${ACTION.DIRECTORY_UPDATE}`, res);
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
    getDirectory() {
      DirectoriesApi.get(this.form.id)
        .then(res => {
          const item = res;
          this.form.directoryName = item.name;
        })
        .catch(err => console.log(err));
    }
  },
  mounted() {
    this.getDirectory();
  }
};
</script>

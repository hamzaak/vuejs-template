<template>
  <el-card class="box-card">
    <page-header :onBack="_onCancel">
      <template v-slot:left>Update Directory</template>
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
          <el-form-item label="Directory Name">
            <el-input placeholder="Please input directory name" v-model="form.directoryName" class="block"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import * as ACTION from "../../store/constants/actions";
import * as MODULE from "../../store/constants/modules";
import DirectoriesApi from "../../api/directoriesApi";
import PageHeader from "../../components/PageHeader";

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
            { required: true, message: 'Please input directory name', trigger: 'blur' },
            { min: 3, message: 'Directory name min length should be 5', trigger: 'blur' }
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
        const directory = {
            id: parseInt(this.form.id),
            name: this.form.directoryName
        };
        DirectoriesApi.update(directory)
          .then((res) => {
            console.log(res)
            this.form.loading = false;
            this.$message({ message: "Directory has been updated successfuly.", type: "success" });
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

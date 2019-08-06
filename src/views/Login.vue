<template>
  <el-container>
    <el-main>
      <el-form
        :model="signinForm"
        :rules="signinRules"
        ref="signinForm"
        label-position="left"
        label-width="0px"
        class="demo-ruleForm login-container"
      >
        <h3 class="title">Sign in</h3>
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="signinForm.username"
            auto-complete="off"
            placeholder="Username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="signinForm.password"
            auto-complete="off"
            placeholder="Password"
          ></el-input>
        </el-form-item>
        <el-checkbox v-model="signinForm.remember" class="remember">Remember</el-checkbox>
        <el-form-item style="width:100%">
          <el-button
            type="primary"
            style="width:100%"
            @click.native.prevent="login"
            :loading="signing"
          >Sign in</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import AuthApi from "../api/authApi";

export default {
  data() {
    return {
      signing: false,
      signinForm: {
        username: "Admin",
        password: "Admin123",
        remember: false
      },
      signinRules: {
        username: [
          { required: true, message: "Username is required", trigger: "blur" }
        ],
        password: [
          { required: true, message: "Password is required", trigger: "blur" }
        ]
      },
      isRememberChecked: true
    };
  },
  methods: {
    login() {
      this.$refs.signinForm.validate(valid => {
        if (valid) {
          this.signing = true;
          var loginParams = {
            username: this.signinForm.username,
            password: this.signinForm.password,
            remember: this.signinForm.remember
          };

          AuthApi.login(loginParams)
            .then(res => {
              this.signing = false;
              if (res.token) {
                AuthApi.setLocalUser(res.user);
                AuthApi.setLocalToken(res.token);
                this.$router.push("/summary");
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                  showClose: true,
                  duration: 5000
                });
              }
            })
            .catch(err => {
              console.log(JSON.stringify(err))
              this.signing = false;
              this.$message({
                message: err,
                type: "error",
                showClose: true,
                duration: 5000
              });
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/Login.scss";
</style>

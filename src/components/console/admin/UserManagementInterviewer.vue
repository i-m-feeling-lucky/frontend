<template>
  <v-row no-gutters>
    <v-col class="mx-auto mt-3" cols="12" sm="8" md="4">
      <v-card elevation="4">
        <v-img
          src="@/assets/banner-shake-hand.jpg"
          height="125"
          class="align-end"
        >
          <v-icon dark size="60" class="ml-6">mdi-account-plus</v-icon>
          <v-card-title class="pt-0 pb-4 text-h5 white--text">添加面试官</v-card-title>
        </v-img>

        <v-card-text class="pa-0">
          <v-form v-model="valid" ref="form">
            <v-container>
              <v-row>
                <v-col cols="10" class="mx-auto">
                  <v-text-field
                    v-model="email"
                    label="电子邮箱"
                    v-bind="attrs"
                    v-on="on"
                    :rules=emailRules
                  ></v-text-field>
                </v-col>
                <v-col cols="10" class="mx-auto">
                  <v-text-field
                    v-model="password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="passwordRules"
                    :type="showPassword ? 'text' : 'password'"
                    name="input-10-1"
                    label="密码"
                    counter
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-row justify="center">
            <v-btn color="primary" @click="onAddNewInterviewer"
              :loading="loadingAdd" :disabled="loadingAdd">确定</v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;

export default Vue.extend({
  name: 'UserManagementInterviewer',
  metaInfo: {
    title: '面试官 管理',
  },
  data() {
    return {
      loadingAdd: false,
      valid: false,

      email: '',
      emailRules: [
        (email: string) => !!email || '必须填写电子邮箱地址',
        (email: string) => /.+@.+\..+/.test(email) || '电子邮箱地址须有效',
      ],

      showPassword: false,
      password: '',
      passwordRules: [
        (password: string) => !!password || '必须填写密码',
      ],
    };
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  methods: {
    ...mapMutations(['setError', 'setSuccess']),
    onAddNewInterviewer() {
      if ((this.$refs.form as any).validate()) {
        this.loadingAdd = true;
        axios.post(`${API_URL}/HR`,
          {
            email: this.email,
            password: this.password,
            role: 2, // interviewer
          },
          {
            headers: { 'X-Token': this.getUser.token },
          })
          .then((response) => {
            this.loadingAdd = false;
            this.setSuccess('添加HR成功');
          }).catch((error) => {
            if (error.response) {
              this.setError(`Error: ${error.response.status.toString()} ${error.response.statusText}`);
            } else if (error.request) {
              this.setError('Error: 服务器无响应');
            } else {
              this.setError('Error: 生成请求时发生异常');
            }
            this.loadingAdd = false;
          });
      }
    },
  },
});
</script>

<template>
  <v-row no-gutters>
    <v-col class="mx-auto mt-3" cols="12" sm="8" md="4">
      <v-card elevation="4">
        <v-img
          src="@/assets/banner-legs.jpg"
          height="125"
          class="align-end"
        >
          <v-icon dark size="60" class="ml-6">mdi-account-multiple-plus</v-icon>
          <v-card-title class="pt-0 pb-4 text-h5 white--text">添加候选人</v-card-title>
        </v-img>
        <v-card-text class="pa-0">
          <v-form v-model="valid" ref="form1">
            <v-container>
              <v-row>
                <v-col cols="10" class="mx-auto">
                  <v-text-field
                    v-model="email"
                    label="电子邮箱"
                    v-bind="attrs"
                    v-on="on"
                    :rules="emailRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="10" class="mx-auto">
                  <v-text-field
                    v-model="name"
                    label="姓名"
                    v-bind="attrs"
                    v-on="on"
                    :rules="nameRules"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-row justify="center">
            <v-btn color="primary" @click="onAddNewInterviewee"
              :loading="loadingAdd" :disabled="loadingAdd">确定</v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col class="mx-auto mt-3" cols="12" sm="8" md="4">
      <v-card elevation="4">
        <v-img
          src="@/assets/banner-legs.jpg"
          height="125"
          class="align-end"
        >
          <v-icon dark size="60" class="ml-6">mdi-account-multiple-plus</v-icon>
          <v-card-title class="pt-0 pb-4 text-h5 white--text">批量上传候选人</v-card-title>
        </v-img>
        <v-card-text class="pa-0">
          <v-form v-model="valid" ref="form2">
            <v-container>
              <v-row>
                <v-col cols="10" class="mx-auto">
                  <v-file-input accept=".csv,.xls,.xlsx"
                    label="选择文件(.csv, .xls, .xlsx)"
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-row justify="center">
            <v-btn color="primary" @click="onUploadNewInterviewee"
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
  name: 'UserManagementInterviewee',
  metaInfo: {
    title: '候选人 管理',
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

      name: '',
      nameRules: [
        (name: string) => !!name || '必须填写姓名',
      ],

    };
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  methods: {
    ...mapMutations(['setError', 'setSuccess']),
    onAddNewInterviewee() {
      if ((this.$refs.form1 as any).validate()) {
        this.loadingAdd = true;
        axios.post(`${API_URL}/user`,
          {
            email: this.email,
            name: this.name,
          },
          {
            headers: { 'X-Token': this.getUser.token },
          })
          .then((response) => {
            this.loadingAdd = false;
            this.setSuccess('添加候选人成功');
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
    onUploadNewInterviewee() {
      if ((this.$refs.form2 as any).validate()) {
        this.loadingAdd = true;
        axios.post(`${API_URL}/user`,
          {
            email: '',
            name: '',
          },
          {
            headers: { 'X-Token': this.getUser.token },
          })
          .then((response) => {
            this.loadingAdd = false;
            this.setSuccess('上传候选人成功');
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

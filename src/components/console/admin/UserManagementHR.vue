<template>
  <v-row no-gutters>
    <v-col class="mx-auto mt-3" cols="12" sm="8" md="3">
      <v-card elevation="4">
        <v-img
          src="@/assets/banner-legs.jpg"
          height="125"
          class="align-end"
        >
          <v-icon dark size="60" class="ml-6">mdi-account-multiple-plus</v-icon>
          <v-card-title class="pt-0 pb-4 text-h5 white--text">分配候选人</v-card-title>
        </v-img>
        <v-card-text class="pa-0">
          <v-form v-model="valid" ref="form1">
            <v-container>
              <v-row no-gutters>
                <v-col cols="10" class="mx-auto">
                 <v-select
                    v-model="selectedHREmail1"
                    :items="HREmails1"
                    :rules="HRRules"
                    label="HR"
                    prepend-icon="mdi-account-tie"
                  ></v-select>
                </v-col>
                <v-col cols="10" class="mx-auto">
                 <v-select
                    v-model="selectedIntervieweeEmail"
                    :items="intervieweeEmails"
                    :rules="intervieweeRules"
                    label="候选人"
                    prepend-icon="mdi-account-tie-outline"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-row justify="center">
            <v-btn color="primary" @click="onAssignNewHRInterviewee"
              :loading="loadingAdd" :disabled="loadingAdd">确定</v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col class="mx-auto mt-3" cols="12" sm="8" md="3">
      <v-card elevation="4">
        <v-img
          src="@/assets/banner-shake-hand.jpg"
          height="125"
          class="align-end"
        >
          <v-icon dark size="60" class="ml-6">mdi-account-multiple-plus</v-icon>
          <v-card-title class="pt-0 pb-4 text-h5 white--text">分配面试官</v-card-title>
        </v-img>
        <v-card-text class="pa-0">
          <v-form v-model="valid" ref="form2">
            <v-container>
              <v-row no-gutters>
                <v-col cols="10" class="mx-auto">
                 <v-select
                    v-model="selectedHREmail2"
                    :items="HREmails2"
                    :rules="HRRules"
                    label="HR"
                    prepend-icon="mdi-account-tie"
                  ></v-select>
                </v-col>
                <v-col cols="10" class="mx-auto">
                 <v-select
                    v-model="selectedInterviewerEmail"
                    :items="interviewerEmails"
                    :rules="interviewerRules"
                    label="面试官"
                    prepend-icon="mdi-account-tie"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-row justify="center">
            <v-btn color="primary" @click="onAssignNewHRInterviewer"
              :loading="loadingAdd" :disabled="loadingAdd">确定</v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col class="mx-auto mt-3" cols="12" sm="8" md="3">
      <v-card elevation="4">
        <v-img
          src="@/assets/banner-shake-hand.jpg"
          height="125"
          class="align-end"
        >
          <v-icon dark size="60" class="ml-6">mdi-account-plus</v-icon>
          <v-card-title class="pt-0 pb-4 text-h5 white--text">添加HR</v-card-title>
        </v-img>
        <v-card-text class="pa-0">
          <v-form v-model="valid" ref="form3">
            <v-container>
              <v-row no-gutters>
                <v-col cols="10" class="mx-auto">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="电子邮箱"
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
            <v-btn color="primary" @click="onAddNewHR"
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
  name: 'UserManagementHR',
  metaInfo: {
    title: 'HR 管理',
  },
  data() {
    return {
      loadingAdd: false,
      valid: false,

      HRs: [] as any[],
      HREmails1: [] as string[],
      selectedHREmail1: '',
      HREmails2: [] as string[],
      selectedHREmail2: '',
      HRRules: [
        (HR: string) => !!HR || '需要选择HR',
      ],

      interviewers: [] as any[],
      interviewerEmails: [] as string[],
      selectedInterviewerEmail: '',
      interviewerRules: [
        (interviewer: string) => !!interviewer || '需要选择面试官',
      ],

      intervieweeEmails: [] as string[],
      selectedIntervieweeEmail: '',
      intervieweeRules: [
        (interviewee: string) => !!interviewee || '需要选择候选人',
      ],

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
    onAssignNewHRInterviewee() {
      if ((this.$refs.form1 as any).validate()) {
        this.loadingAdd = true;
        axios.post(`${API_URL}/user/assign/interviewee`,
          {
            hr: this.HRs.find(
              (hr: any) => hr.email === this.selectedHREmail1,
            ).id,
            interviewee: this.selectedIntervieweeEmail,
          },
          {
            headers: { 'X-Token': this.getUser.token },
          })
          .then((response) => {
            this.loadingAdd = false;
            this.setSuccess('分配候选人成功');
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
    onAssignNewHRInterviewer() {
      if ((this.$refs.form2 as any).validate()) {
        this.loadingAdd = true;
        axios.post(`${API_URL}/user/assign/interviewer`,
          {
            hr: this.HRs.find(
              (hr: any) => hr.email === this.selectedHREmail2,
            ).id,
            interviewer: this.interviewers.find(
              (interviewer: any) => interviewer.email === this.selectedInterviewerEmail,
            ).id,
          },
          {
            headers: { 'X-Token': this.getUser.token },
          })
          .then((response) => {
            this.loadingAdd = false;
            this.setSuccess('分配面试官成功');
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
    onAddNewHR() {
      if ((this.$refs.form3 as any).validate()) {
        this.loadingAdd = true;
        axios.post(`${API_URL}/user`,
          [
            {
              email: this.email,
              password: this.password,
              role: 1, // HR
            },
          ],
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
  mounted() {
    axios.get(`${API_URL}/user`,
      {
        headers: { 'X-Token': this.getUser.token },
      })
      .then((response) => {
        this.HRs = response.data.filter(
          (user: any) => user.role === 1,
        );
        this.HREmails1 = response.data.filter(
          (user: any) => user.role === 1,
        ).map((user: any) => user.email);
        this.HREmails2 = response.data.filter(
          (user: any) => user.role === 1,
        ).map((user: any) => user.email);
        this.interviewers = response.data.filter(
          (user: any) => user.role === 2,
        );
        this.interviewerEmails = response.data.filter(
          (user: any) => user.role === 2,
        ).map((user: any) => user.email);
      }).catch((error) => {
        if (error.response) {
          this.setError(`Error: ${error.response.status.toString()} ${error.response.statusText}`);
        } else if (error.request) {
          this.setError('Error: 服务器无响应');
        } else {
          console.log(error);
          this.setError('Error: 生成请求时发生异常');
        }
      });
    axios.get(`${API_URL}/interviewee`,
      {
        headers: { 'X-Token': this.getUser.token },
      })
      .then((response) => {
        this.intervieweeEmails = response.data.map(
          (interviewee: any) => interviewee.email,
        );
      }).catch((error) => {
        if (error.response) {
          this.setError(`Error: ${error.response.status.toString()} ${error.response.statusText}`);
        } else if (error.request) {
          this.setError('Error: 服务器无响应');
        } else {
          this.setError('Error: 生成请求时发生异常');
        }
      });
  },
});
</script>

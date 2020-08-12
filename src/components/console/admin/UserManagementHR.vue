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
                    v-model="selectedHRID1"
                    :items="HRIDs1"
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
                    v-model="selectedHRID2"
                    :items="HRIDs2"
                    :rules="HRRules"
                    label="HR"
                    prepend-icon="mdi-account-tie"
                  ></v-select>
                </v-col>
                <v-col cols="10" class="mx-auto">
                 <v-select
                    v-model="selectedInterviewerID"
                    :items="interviewerIDs"
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
                    v-bind="attrs"
                    v-on="on"
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

      HRIDs1: [] as string[],
      selectedHRID1: '',
      HRIDs2: [] as string[],
      selectedHRID2: '',
      HRRules: [
        (HR: string) => !!HR || '需要选择HR',
      ],

      interviewerIDs: [] as string[],
      selectedInterviewerID: '',
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
        axios.post(`${API_URL}/assign/interviewee`,
          {
            hr: Number(this.selectedHRID1),
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
        axios.post(`${API_URL}/assign/interviewer`,
          {
            hr: Number(this.selectedHRID2),
            interviewer: Number(this.selectedInterviewerID),
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
          {
            email: this.email,
            password: this.password,
            role: 1, // HR
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
  mounted() {
    axios.get(`${API_URL}/user`,
      {
        headers: { 'X-Token': this.getUser.token },
      })
      .then((response) => {
        this.HRIDs1 = [response.data.filter(
          (user: any) => user.role === 1,
        )].map((user: any) => user.id.toString());
        this.HRIDs1 = [response.data.filter(
          (user: any) => user.role === 1,
        )].map((user: any) => user.id.toString());
        this.HRIDs1 = [response.data.filter(
          (user: any) => user.role === 2,
        )].map((user: any) => user.id.toString());
      }).catch((error) => {
        if (error.response) {
          this.setError(`Error: ${error.response.status.toString()} ${error.response.statusText}`);
        } else if (error.request) {
          this.setError('Error: 服务器无响应');
        } else {
          this.setError('Error: 生成请求时发生异常');
        }
        // TODO: 因为后端还没实现，所以在这里临时使用一些自己编的数据
        const data = [
          {
            id: 1,
            role: 1,
          },
          {
            id: 2,
            role: 1,
          },
          {
            id: 3,
            role: 2,
          },
          {
            id: 4,
            role: 2,
          },
          {
            id: 5,
            role: 2,
          },
        ];
        this.HRIDs1 = data.filter(
          (user) => user.role === 1,
        ).map((user: any) => user.id.toString());
        this.HRIDs2 = data.filter(
          (user) => user.role === 1,
        ).map((user: any) => user.id.toString());
        this.interviewerIDs = data.filter(
          (user) => user.role === 2,
        ).map((user: any) => user.id.toString());
      });
    axios.get(`${API_URL}/interviewee`,
      {
        headers: { 'X-Token': this.getUser.token },
      })
      .then((response) => {
        this.intervieweeEmails = response.data.map(
          (email: string) => email.toString(),
        );
      }).catch((error) => {
        if (error.response) {
          this.setError(`Error: ${error.response.status.toString()} ${error.response.statusText}`);
        } else if (error.request) {
          this.setError('Error: 服务器无响应');
        } else {
          this.setError('Error: 生成请求时发生异常');
        }
        // TODO: 因为后端还没实现，所以在这里临时使用一些自己编的数据
        const data = {
          interviewees: [
            {
              email: 'jackweller@gmail.com',
            },
            {
              email: 'yusanshi@163.com',
            },
            {
              email: 'anothertest@gmail.com',
            },
            {
              email: 'fortest@126.com',
            },
          ],
        };
        this.intervieweeEmails = data.interviewees.map(
          (interviewee: any) => interviewee.email,
        );
      });
  },
});
</script>

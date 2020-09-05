<template>
  <v-row no-gutters>
    <v-col class="mx-auto mt-3" cols="12" sm="7" md="8">
      <v-card style="padding:5%">
        <v-card-title>HR</v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="HRs"
          :search="search"
        ></v-data-table>
      </v-card>
    </v-col>
    <v-col class="mx-auto mt-3" cols="12" sm="7" md="8">
      <v-card style="padding:5%">
        <v-card-title>HR分配关系</v-card-title>
          <v-form v-model="valid" ref="form">
            <v-select
              v-model="selectedHRid"
              :items="HRids"
              label="HR"
              prepend-icon="mdi-account-tie"
            ></v-select>
            <v-card-actions>
              <v-row justify="center">
                <v-btn color="primary" @click="onSearchAssign"
                  :loading="loadingAdd" :disabled="loadingAdd">查询</v-btn>
              </v-row>
            </v-card-actions>
          </v-form>
        <v-data-table
          :headers="headersAssignInterviewers"
          :items="HRsAssignInterviewers"
        ></v-data-table>
        <v-data-table
          :headers="headersAssignInterviewees"
          :items="HRsAssignInterviewees"
        ></v-data-table>
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
  name: 'UserSearchInterviewee',
  metaInfo: {
    title: 'HR 查询',
  },
  data() {
    return {
      loadingAdd: false,
      valid: false,

      search: '',
      headers: [
        { text: 'id', value: 'id' },
        { text: '电子邮箱', value: 'email' },
      ],
      headersAssignInterviewers: [
        { text: 'id', value: 'uid' },
        { text: '电子邮箱', value: 'email' },
      ],
      headersAssignInterviewees: [
        { text: '电子邮箱', value: 'email' },
        { text: '姓名', value: 'name' },
        { text: '面试结果', value: 'application_result' },
      ],
      HRs: [{}],
      HRids: [] as number[],
      selectedHRid: '',
      HRsAssignInterviewers: [{}],
      HRsAssignInterviewees: [{}],
    };
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  methods: {
    ...mapMutations(['setError', 'setSuccess']),
    onSearchAssign() {
      if ((this.$refs.form as any).validate()) {
        this.loadingAdd = true;
        axios.get(`${API_URL}/user/${this.selectedHRid}/assignment`,
          {
            headers: { 'X-Token': this.getUser.token },
          })
          .then((response) => {
            this.HRsAssignInterviewers = response.data.interviewers;
            this.HRsAssignInterviewees = response.data.interviewees.map((data: any) => ({
              email: data.interviewees.email,
              name: data.interviewees.name,
              // eslint-disable-next-line
              application_result: data.interviewees.application_result === 1 ? '通过' : '不通过',
            }));
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
        this.HRids = this.HRs.map(
          (HR: any) => HR.id,
        );
        console.log(this.selectedHRid);
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

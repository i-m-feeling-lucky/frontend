<template>
  <v-row no-gutters>
    <v-col class="mx-auto" cols="12" sm="7" md="8">
      <v-card style="padding:5%">
        <v-card-title>候选人</v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="interviewees"
          :search="search"
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
    title: '候选人 查询',
  },
  data() {
    return {
      loadingAdd: false,
      valid: false,

      search: '',
      headers: [
        { text: '电子邮箱', value: 'email' },
        { text: '姓名', value: 'name' },
        { text: '面试结果', value: 'application_result' },
      ],
      interviewees: [{}],
    };
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  methods: {
    ...mapMutations(['setError', 'setSuccess']),
  },
  mounted() {
    axios.get(`${API_URL}/interviewee`,
      {
        headers: { 'X-Token': this.getUser.token },
      })
      .then((response) => {
        this.interviewees = response.data.map((data: any) => ({
          email: data.email,
          name: data.name,
          // eslint-disable-next-line
          application_result: data.application_result === 1 ? '通过' : '不通过',
        }));
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

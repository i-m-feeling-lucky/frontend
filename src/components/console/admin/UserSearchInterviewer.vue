<template>
  <v-row no-gutters>
    <v-col class="mx-auto" cols="12" sm="7" md="8">
      <v-card>
        <v-card-title>面试官</v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="interviewers"
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
    title: '面试官 查询',
  },
  data() {
    return {
      loadingAdd: false,
      valid: false,

      search: '',
      headers: [
        { text: 'id', value: 'id' },
        { text: 'email', value: 'email' },
      ],
      interviewers: [{}],
    };
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  methods: {
    ...mapMutations(['setError', 'setSuccess']),
  },
  mounted() {
    axios.get(`${API_URL}/user`,
      {
        headers: { 'X-Token': this.getUser.token },
      })
      .then((response) => {
        this.interviewers = response.data.filter(
          (user: any) => user.role === 2,
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
        const data = [
          {
            id: 1,
            email: 'hr1@lucky.com',
            role: 1,
          },
          {
            id: 2,
            email: 'hr2@lucky.com',
            role: 1,
          },
          {
            id: 3,
            email: 'interviewer3@lucky.com',
            role: 2,
          },
          {
            id: 4,
            email: 'interviewer4@lucky.com',
            role: 2,
          },
          {
            id: 5,
            email: 'interviewer5@lucky.com',
            role: 2,
          },
        ];
        this.interviewers = data.filter(
          (user: any) => user.role === 2,
        );
        console.log(this.interviewers);
      });
  },
});
</script>

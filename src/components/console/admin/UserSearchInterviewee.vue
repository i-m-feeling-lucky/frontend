<template>
  <v-row no-gutters>
    <v-col class="mx-auto" cols="12" sm="7" md="8">
      <v-card>
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
        { text: 'email', value: 'email' },
        { text: 'name', value: 'name' },
        { text: 'application result', value: 'application_result' },
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
        this.interviewees = response.data;
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
            email: 'jackweller@gmail.com',
            name: 'Jack Weller',
            // eslint-disable-next-line
            application_result: 0,
          },
          {
            email: 'yusanshi@163.com',
            name: 'Yu Sanshi',
            // eslint-disable-next-line
            application_result: 1,
          },
          {
            email: 'anothertest@gmail.com',
            name: 'another test',
            // eslint-disable-next-line
            application_result: 1,
          },
          {
            email: 'fortest@126.com',
            name: 'for test',
            // eslint-disable-next-line
            application_result: 0,
          },
        ];
        this.interviewees = data;
        console.log(this.interviewees);
      });
  },
});
</script>

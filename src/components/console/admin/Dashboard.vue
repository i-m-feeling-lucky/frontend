<template>
  <!-- eslint-disable max-len -->
  <div class="page--dash">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="mdi-account-box-multiple"
            :title="data.hrs.length.toString()"
            sub-title="HR人数"
            color="indigo"
          />
        </v-flex>
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="mdi-folder-account"
            :title="data.interviewers.length.toString()"
            sub-title="面试官人数"
            color="red"
          />
        </v-flex>
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="mdi-cash-multiple"
            :title="interviewees.length.toString()"
            sub-title="总候选人"
            color="light-blue"
          />
        </v-flex>
                <v-flex lg8 sm12 xs12>
          <v-card>
            <v-card-title>候选人</v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          style="margin:10px"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="interviewees"
          :search="search"
        ></v-data-table>
          </v-card>
        </v-flex>
        <v-flex lg4 sm12 xs12>
          <v-widget title="面试结果" content-bg="white" >
            <div slot="widget-content">
              <e-chart
                :path-option="[
                  ['dataset.source', rate],
                  ['legend.bottom', '0'],
                  [
                    'color',
                    [
                      color.lightBlue.base,
                      color.indigo.base,
                      color.pink.base,
                      color.green.base,
                      color.cyan.base,
                      color.teal.base
                    ]
                  ],
                  ['xAxis.show', false],
                  ['yAxis.show', false],
                  ['series[0].type', 'pie'],
                  ['series[0].avoidLabelOverlap', true],
                  ['series[0].radius', ['50%', '70%']]
                ]"
                height="400px"
                width="100%"
              />
            </div>
          </v-widget>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import axios from 'axios';
import EChart from '@/components/chart/echart';
import MiniStatistic from '@/components/widgets/MiniStatistic.vue';
import VWidget from '@/components/widgets/VWidget.vue';
import Material from 'vuetify/es5/util/colors';

/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-explicit-any */

const API_URL = process.env.VUE_APP_API_URL;
export default Vue.extend({
  name: 'Dashboard',
  metaInfo: {
    title: '仪表盘',
  },
  components: {
    VWidget,
    MiniStatistic,
    EChart,
  },
  data() {
    return {
      color: Material,
      select: {
        hr: { items: [] as string[], value: '' },
        interviewer: { items: [] as string[], value: '' },
      },
      search: '',
      data: {
        hrs: [],
        interviewers: [],
        accounts: [],
        loans: [],
      },
      interviewees: [{}],
      interviews: [{}],
      headers: [
        { text: '邮件', value: 'email' },
        { text: '姓名', value: 'name' },
        { text: '申请结果', value: 'application_result' },
      ],
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    rate(): object {
      const arr = ['S', 'A', 'B', 'C', 'D'];
      return [1, 2, 3, 4, 5].map((x) => ({
        value: this.interviews.filter((e: any) => e.rate === x).length,
        name: arr[x - 1],
      }));
    },
  },
  methods: {
    ...mapMutations(['setError']),
  },
  created() {
    axios
      .get(`${API_URL}/user`, {
        headers: { 'X-Token': this.getUser.token },
      })
      .then((response) => {
        this.data.hrs = response.data.filter(
          (user: any) => user.role === 1,
        );
        this.select.hr.items = this.data.hrs.map((e: any) => e.name);
        [this.select.hr.value] = this.select.hr.items;
        this.data.interviewers = response.data.filter(
          (user: any) => user.role === 2,
        );
        this.select.interviewer.items = this.data.interviewers.map((e: any) => e.name);
        [this.select.interviewer.value] = this.select.interviewer.items;
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          this.setError(error.response.data.message);
        } else {
          this.setError(error.message);
        }
      });
    axios.get(`${API_URL}/interviewee`,
      {
        headers: { 'X-Token': this.getUser.token },
      })
      .then((response) => {
        this.interviewees = response.data;
        const item = ['未定', '通过', '拒绝'];
        for (let j = 0, len = this.interviewees.length; j < len; j += 1) {
          this.interviewees[j].application_result = item[this.interviewees[j].application_result];
          console.log(this.interviewees[j]);
        }
      }).catch((error) => {
        if (error.response) {
          this.setError(`Error: ${error.response.status.toString()} ${error.response.statusText}`);
        } else if (error.request) {
          this.setError('Error: 服务器无响应');
        } else {
          this.setError('Error: 生成请求时发生异常');
        }
      });
    axios.get(`${API_URL}/interview`,
      {
        headers: { 'X-Token': this.getUser.token },
      })
      .then((response) => {
        this.interviews = response.data;
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

<template>
 <v-row no-gutters>
    <v-col class="mx-auto" cols="12" sm="4" md="3">
      <v-card>
        <v-card-title class="pb-0">
          候选人
        </v-card-title>
        <v-list two-line class="px-sm-4">
          <v-divider></v-divider>
          <v-list-item
            v-for="item in interviewees"
            :key="item.email"
            @click="intervieweeClicked(item.email)"
            class="pa-0"
          >
            <v-list-item-avatar>
              <v-icon class="grey lighten-1 white--text">
                mdi-account-tie
              </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                {{item.email}}
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-chip-group
                  v-model="item.application_result"
                  mandatory
                >
                  <v-chip
                    small
                    active-class="orange--text text--accent-4"
                    @click.stop="chipPendingClicked(item.email)"
                    v-show="item.application_result===0">
                    待定
                  </v-chip>
                  <v-chip
                    small
                    active-class="green--text text--accent-4"
                    @click.stop="chipApprovedClicked(item.email)"
                    v-show="item.application_result===1">
                    通过
                  </v-chip>
                  <v-chip
                    small
                    active-class="red--text text--accent-4"
                    @click.stop="chipRejectedClicked(item.email)"
                    v-show="item.application_result===2">
                    拒绝
                  </v-chip>
                </v-chip-group>
              </v-list-item-subtitle>
            </v-list-item-content>
            <!--
            <v-list-item-action>
              <v-btn icon>
                <v-icon color="blue lighten-1">mdi-information</v-icon>
              </v-btn>
            </v-list-item-action>
            -->
          </v-list-item>
        </v-list>
        <v-card-text class="text-center text--secondary" v-if="!this.interviewees.length">
          无数据~
        </v-card-text>
      </v-card>
      <v-dialog v-model="dialogApplicationResult" max-width="310">
        <v-card>
          <v-card-title>
            {{dialogTitle}}
          </v-card-title>
          <v-card-text>
            {{dialogText}}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="orange darken-1"
              text
              @click="setResult(0)"
              v-show="dialogStatus!==0"
            >
              待定
            </v-btn>

            <v-btn
              color="green darken-1"
              text
              @click="setResult(1)"
              v-show="dialogStatus!==1"
            >
              通过
            </v-btn>

            <v-btn
              color="red darken-1"
              text
              @click="setResult(2)"
              v-show="dialogStatus!==2"
            >
              拒绝
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
    <v-col class="mx-auto mt-2" cols="12" sm="7" md="8">
      <v-card>
        <v-card-title>{{tableInterviewee}}</v-card-title>
        <v-data-table
          :headers="headers"
          :items="tableContent"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:item.rate="{ item }">
            <v-chip :color="getColor(item.rate)" dark>{{ item.rate }}</v-chip>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
 </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import axios from 'axios';
import moment from 'moment';

const API_URL = process.env.VUE_APP_API_URL;

export default Vue.extend({
  name: 'UserManagementInterviewee',
  metaInfo: {
    title: '候选人管理',
  },
  methods: {
    ...mapMutations(['setError']),
    intervieweeClicked(email: string) {
      this.tableInterviewee = email;
      this.tableContent = this.intervieweeInterviews.find(
        (item: any) => item.email === email,
      ).interviews;
    },
    chipPendingClicked(email: string) {
      this.dialogTitle = '设定申请结果';
      this.dialogText = '';
      this.dialogStatus = 0;
      this.dialogInterviewee = email;
      this.dialogApplicationResult = true;
    },
    chipApprovedClicked(email: string) {
      this.dialogTitle = '修改申请结果';
      this.dialogText = '此候选人的申请结果已经被设为“通过”，请慎重修改。';
      this.dialogStatus = 1;
      this.dialogInterviewee = email;
      this.dialogApplicationResult = true;
    },
    chipRejectedClicked(email: string) {
      this.dialogTitle = '修改申请结果';
      this.dialogText = '此候选人的申请结果已经被设为“拒绝”，请慎重修改。';
      this.dialogStatus = 2;
      this.dialogInterviewee = email;
      this.dialogApplicationResult = true;
    },
    setResult(result: number) {
      axios.put(`${API_URL}/user/application_result`,
        {
          interviewee: this.dialogInterviewee,
          // eslint-disable-next-line
          application_result: result,
        },
        {
          headers: { 'X-Token': this.getUser.token },
        })
        .then(() => {
          this.interviewees[this.interviewees.findIndex(
            (interviewee: any) => interviewee.email === this.dialogInterviewee,
            // eslint-disable-next-line
          )].application_result = result;
          this.dialogApplicationResult = false;
        })
        .catch((error) => {
          if (error.response) {
            this.setError(`Error: ${error.response.status.toString()} ${error.response.statusText}`);
          } else if (error.request) {
            this.setError('Error: 服务器无响应');
          } else {
            this.setError('Error: 生成请求时发生异常');
          }
          this.dialogApplicationResult = false;
        });
    },
    getColor(rate: string) {
      if (rate === 'S') return 'green';
      if (rate === 'A') return 'green lighten-1';
      if (rate === 'B') return 'orange lighten-1';
      if (rate === 'C') return 'pink lighten-1';
      if (rate === 'D') return 'red';
      return 'grey';
    },
  },
  data() {
    return {
      dialogApplicationResult: false,
      dialogTitle: '',
      dialogText: '',
      dialogStatus: 0,
      dialogInterviewee: '',

      interviewees: [] as any,
      interviews: [] as any,

      tableInterviewee: '面试官评价（请选择要查看的候选人）',

      headers: [
        {
          text: '面试官', align: 'start', sortable: false, value: 'interviewer',
        },
        { text: '时间', value: 'start_time' },
        { text: '时长（分钟）', sortable: false, value: 'length' },
        { text: '评分', sortable: false, value: 'rate' },
        { text: '评语', sortable: false, value: 'comment' },
      ],
      tableContent: [],
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    intervieweeInterviews(): any[] {
      return this.interviewees.map(
        (interviewee: any) => ({
          email: interviewee.email,
          // eslint-disable-next-line
          application_result: interviewee.application_result,
          interviews: this.interviews.filter(
            (interview: any) => interview.interviewee === interviewee.email,
          ),
        }),
      );
    },
  },
  mounted() {
    // HR 拿到自己负责的所有候选人的邮箱和每个候选人现在的申请结果
    axios.get(`${API_URL}/user/${this.getUser.id}/assignment`,
      {
        headers: { 'X-Token': this.getUser.token },
      })
      .then((response) => {
        this.interviewees = response.data.interviewees;
      }).catch((error) => {
        if (error.response) {
          this.setError(`Error: ${error.response.status.toString()} ${error.response.statusText}`);
        } else if (error.request) {
          this.setError('Error: 服务器无响应');
        } else {
          this.setError('Error: 生成请求时发生异常');
        }
      });
    // 获取所有面试，过滤后只剩下与此 HR 相关，且已经结束了的面试
    axios.get(`${API_URL}/interview`,
      {
        headers: { 'X-Token': this.getUser.token },
      })
      .then((response) => {
        this.interviews = response.data.filter(
          (interview: any) => interview.hr === this.getUser.id && interview.status === 'ended',
        ).map((interview: any) => ({
          interviewee: interview.interviewee,
          interviewer: interview.interviewer,
          token: interview.token,
          // eslint-disable-next-line
          start_time: moment.unix(interview.start_time).format('M月D日 kk:mm'),
          length: interview.length,
          rate: ['S', 'A', 'B', 'C', 'D'][interview.rate],
          comment: interview.comment,
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

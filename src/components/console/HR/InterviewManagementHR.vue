<template>
  <v-row no-gutters>
    <v-col class="mx-auto" cols="12" sm="8" md="6">
      <v-expansion-panels popout multiple v-model="panel">

        <v-expansion-panel hide-actions>
          <v-expansion-panel-header>
            <v-row align="center" no-gutters>
              <v-icon color="red" class="mr-5">mdi-ray-start</v-icon>
              <strong>未开始</strong>
              <span v-if="this.upcomingInterviews.length" class="grey--text">
                &nbsp;({{ this.upcomingInterviews.length }})
              </span>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-list two-line class="px-sm-4" v-if="upcomingInterviews.length">
              <template v-for="item in upcomingInterviews">
                <v-list-item
                  :key="item.id"
                  @click="$router.push({path: `/interview/${item.id}`})"
                  class="pa-0"
                >
                  <v-list-item-avatar>
                    <v-icon class="grey lighten-1 white--text">
                      mdi-account-tie
                    </v-icon>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>
                      {{item.interviewee}}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-subtitle-2">
                      {{unixToString(item.start_time)}}
                      <span class="text-center">
                        <v-chip
                          small
                          color="green lighten-1"
                          text-color="white"
                        >
                          <v-icon left size="17">mdi-clock-time-two-outline</v-icon>
                          {{item.length}}分钟
                        </v-chip>
                      </span>
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
                <v-divider :key="item.start_time"></v-divider>
              </template>
            </v-list>
            <v-card-text class="text-center text--secondary" v-else>
              没有待开始的面试哦~
            </v-card-text>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel hide-actions>
          <v-expansion-panel-header>
            <v-row align="center" no-gutters>
              <v-icon color="orange" class="mr-5">mdi-ray-vertex</v-icon>
              <strong>进行中</strong>
              <span v-if="this.activeInterviews.length" class="grey--text">
                &nbsp;({{ this.activeInterviews.length }})
              </span>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-list two-line class="px-sm-4" v-if="activeInterviews.length">
              <template v-for="item in activeInterviews">
                <v-list-item
                  :key="item.id"
                  @click="$router.push({path: `/interview/${item.id}`})"
                  class="pa-0"
                >
                  <v-list-item-avatar>
                    <v-icon class="grey lighten-1 white--text">
                      mdi-account-tie
                    </v-icon>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>
                      {{item.interviewee}}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-subtitle-2">
                      {{unixToString(item.start_time)}}
                      <span class="text-center">
                        <v-chip
                          small
                          color="green"
                          text-color="white"
                        >
                          <v-icon left size="17">mdi-clock-time-two-outline</v-icon>
                          {{item.length}}分钟
                        </v-chip>
                      </span>
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
                <v-divider :key="item.start_time"></v-divider>
              </template>
            </v-list>
            <v-card-text class="text-center text--secondary" v-else>
              没有进行中的面试
            </v-card-text>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel hide-actions>
          <v-expansion-panel-header>
            <v-row align="center" no-gutters>
              <v-icon color="green" class="mr-5">mdi-ray-end</v-icon>
              <strong>已结束</strong>
              <span v-if="this.endedInterviews.length" class="grey--text">
                &nbsp;({{ this.endedInterviews.length }})
              </span>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-list two-line class="px-sm-4" v-if="endedInterviews.length">
              <template v-for="item in endedInterviews">
                <v-list-item
                  :key="item.id"
                  @click="$router.push({path: `/interview/${item.id}`})"
                  class="pa-0"
                >
                  <v-list-item-avatar>
                    <v-icon class="grey lighten-1 white--text">
                      mdi-account-tie
                    </v-icon>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>
                      {{item.interviewee}}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-subtitle-2">
                      {{unixToString(item.start_time)}}
                      <span class="text-center">
                        <v-chip
                          small
                          color="grey"
                          text-color="white"
                        >
                          <v-icon left size="17">mdi-clock-time-two-outline</v-icon>
                          {{item.length}}分钟
                        </v-chip>
                      </span>
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
                <v-divider :key="item.start_time"></v-divider>
              </template>
            </v-list>
            <v-card-text class="text-center text--secondary" v-else>
              无数据
            </v-card-text>
          </v-expansion-panel-content>
        </v-expansion-panel>

      </v-expansion-panels>
    </v-col>
    <v-col class="mx-auto mt-3" cols="12" sm="8" md="4">
      <v-card elevation="4">
        <v-img
          src="@/assets/banner-shake-hand.jpg"
          height="125"
          class="align-end"
        >
          <v-icon dark size="60" class="ml-6">mdi-account-multiple-plus</v-icon>
          <v-card-title class="pt-0 pb-4 text-h5 white--text">添加面试</v-card-title>
        </v-img>

        <v-card-text class="pa-0">
          <v-form v-model="valid" ref="form">
            <v-container>
              <v-row no-gutters>
                <v-col cols="10" class="mx-auto">
                 <v-select
                    v-model="selectedInterviewerEmail"
                    :items="InterviewerEmails"
                    :rules="interviewerRules"
                    label="面试官"
                    prepend-icon="mdi-account-tie"
                  ></v-select>
                </v-col>
                <v-col cols="10" class="mx-auto">
                 <v-select
                    v-model="selectedIntervieweeEmail"
                    :items="intervieweeEmails"
                    :rules="intervieweeRules"
                    label="面试者"
                    prepend-icon="mdi-account-tie-outline"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="10" class="mx-auto py-0">
                  <v-menu
                    ref="menu1"
                    v-model="menu1"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        label="日期"
                        prepend-icon="mdi-calendar"
                        readonly
                        required
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      locale="zh-cn"
                      v-model="date"
                      min="2020-01-01"
                      @change="$refs.menu1.save(date)"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="10" class="mx-auto py-0">
                  <v-menu
                    ref="menu2"
                    v-model="menu2"
                    :close-on-content-click="false"
                    :return-value.sync="newStartTime"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="newStartTime"
                        label="开始时间"
                        prepend-icon="mdi-clock-time-two-outline"
                        readonly
                        required
                        v-bind="attrs"
                        v-on="on"
                        :rules="newStartTimeRules"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="menu2"
                      v-model="newStartTime"
                      full-width
                      @click:minute="$refs.menu2.save(newStartTime)"
                      format="24hr"
                    ></v-time-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="10" class="mx-auto py-0">
                  <v-menu
                    ref="menu3"
                    v-model="menu3"
                    :close-on-content-click="false"
                    :return-value.sync="newEndTime"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="newEndTime"
                        label="结束时间"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        required
                        v-bind="attrs"
                        v-on="on"
                        :rules="newEndTimeRules"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="menu3"
                      v-model="newEndTime"
                      full-width
                      @click:minute="$refs.menu3.save(newEndTime)"
                      format="24hr"
                    ></v-time-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-row justify="center">
            <v-btn color="primary" @click="onAddNewInterview"
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
import moment from 'moment';

const API_URL = process.env.VUE_APP_API_URL;

export default Vue.extend({
  name: 'InterviewManagementHR',
  metaInfo: {
    title: 'HR的面试管理',
  },
  data() {
    return {
      panel: [] as number[],
      interviews: [] as any,

      loadingAdd: false,
      valid: false,

      interviewers: [] as any[],
      selectedInterviewerEmail: '',
      interviewerRules: [
        (interviewer: string) => !!interviewer || '需要选择面试官',
      ],

      intervieweeEmails: [] as string[],
      selectedIntervieweeEmail: '',
      intervieweeRules: [
        (interviewee: string) => !!interviewee || '需要选择候选人',
      ],

      date: moment().format().slice(0, 10),
      newStartTime: '',
      newEndTime: '',
      menu1: false,
      menu2: false,
      menu3: false,
      newStartTimeRules: [
        (startTime: string) => !!startTime || '需要选择开始时间',
      ],
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    newEndTimeRules() {
      const newEndTimeRules: any = [(endTime: string) => !!endTime || '需要选择结束时间'];
      if (this.newStartTime !== '') {
        const rule = (endTime: string) => endTime > this.newStartTime || '结束时间必须晚于开始时间';
        newEndTimeRules.push(rule);
      }
      return newEndTimeRules;
    },
    upcomingInterviews(): any[] {
      return this.interviews.filter(
        (interview: any) => interview.status === 'upcoming',
      ).sort((a: any, b: any) => b.start_time - a.start_time);
    },
    activeInterviews(): any[] {
      return this.interviews.filter(
        (interview: any) => interview.status === 'active',
      ).sort((a: any, b: any) => b.start_time - a.start_time);
    },
    endedInterviews(): any[] {
      return this.interviews.filter(
        (interview: any) => interview.status === 'ended',
      ).sort((a: any, b: any) => b.start_time - a.start_time);
    },
    InterviewerEmails(): any[] {
      return this.interviewers.map(
        (interviewer: any) => interviewer.email,
      );
    },
  },
  methods: {
    ...mapMutations(['setError', 'setSuccess']),
    unixToString(num: number) {
      return moment.unix(num).format('M月D日 kk:mm');
    },
    async onAddNewInterview() {
      if ((this.$refs.form as any).validate()) {
        this.loadingAdd = true;
        const momentStart = moment(`${this.date}T${this.newStartTime}:00`);
        const momentEnd = moment(`${this.date}T${this.newEndTime}:00`);
        await axios.post(`${API_URL}/interview`,
          {
            hr: this.getUser.id,
            interviewer: this.interviewers.find(
              (interviewer: any) => interviewer.email === this.selectedInterviewerEmail,
            ).uid,
            interviewee: this.selectedIntervieweeEmail,
            // eslint-disable-next-line
            start_time: momentStart.unix(),
            length: momentEnd.diff(momentStart, 'minutes'),
          },
          {
            headers: { 'X-Token': this.getUser.token },
          })
          .then((response) => {
            this.loadingAdd = false;
            this.setSuccess('添加面试成功');
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
        // 刷新展示的面试列表
        await axios.get(`${API_URL}/interview`,
          {
            headers: { 'X-Token': this.getUser.token },
          })
          .then((response) => {
            this.interviews = response.data.filter(
              (interview: any) => interview.hr === this.getUser.id,
            );
          }).catch((error) => {
            if (error.response) {
              this.setError(`Error: ${error.response.status.toString()} ${error.response.statusText} 刷新面试列表失败`);
            } else if (error.request) {
              this.setError('Error: 刷新面试列表失败，服务器无响应');
            } else {
              this.setError('Error: 刷新面试列表失败，生成请求时发生异常');
            }
          });
      }
    },
  },
  mounted() {
    axios.get(`${API_URL}/interview`,
      {
        headers: { 'X-Token': this.getUser.token },
      })
      .then((response) => {
        this.interviews = response.data.filter(
          (interview: any) => interview.hr === this.getUser.id,
        );
        this.panel = [0, 1];
      }).catch((error) => {
        if (error.response) {
          this.setError(`Error: ${error.response.status.toString()} ${error.response.statusText}`);
        } else if (error.request) {
          this.setError('Error: 服务器无响应');
        } else {
          this.setError('Error: 生成请求时发生异常');
        }
        this.panel = [0, 1];
      });
    axios.get(`${API_URL}/user/${this.getUser.id}/assignment`,
      {
        headers: { 'X-Token': this.getUser.token },
      })
      .then((response) => {
        this.interviewers = response.data.interviewers;
        this.intervieweeEmails = response.data.interviewees.map(
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

<template>
 <!-- eslint-disable max-len -->
  <v-row no-gutters>
    <v-col class="mx-auto" sm="8" md="5">
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
              <v-list-item
                v-for="item in upcomingInterviews"
                :key="item.id"
                @click="$router.push({path: `/interview/${item.id}?token=${item.interviewer_token}`})"
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
            </v-list>
            <v-card-text class="text-center text--secondary" v-else>
              没有新任务，爽~
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
              <v-list-item
                v-for="item in activeInterviews"
                :key="item.id"
                @click="$router.push({path: `/interview/${item.id}?token=${item.interviewer_token}`})"
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
              <v-list-item
                v-for="item in endedInterviews"
                :key="item.id"
                @click="$router.push({path: `/interview/${item.id}?token=${item.interviewer_token}`})"
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
            </v-list>
            <v-card-text class="text-center text--secondary" v-else>
              还从来没有完成过面试
            </v-card-text>
          </v-expansion-panel-content>
        </v-expansion-panel>

      </v-expansion-panels>
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
  name: 'InterviewManagementInterviewer',
  metaInfo: {
    title: '面试官的面试',
  },
  data() {
    return {
      panel: [] as number[],
      interviews: [] as any,
    };
  },
  computed: {
    ...mapGetters(['getUser']),
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
  },
  methods: {
    ...mapMutations(['setError']),
    unixToString(num: number) {
      return moment.unix(num).format('M月D日 kk:mm');
    },
  },
  mounted() {
    axios.get(`${API_URL}/interview`,
      {
        headers: { 'X-Token': this.getUser.token },
      })
      .then((response) => {
        this.interviews = response.data.filter(
          (interview: any) => interview.interviewer === this.getUser.id,
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
  },
});
</script>

<template>
  <div>
    <v-expansion-panels popout v-model="panel">
      <v-expansion-panel hide-actions>
        <v-expansion-panel-header>
          <v-row align="center" no-gutters>
            <v-icon color="red" class="mr-5">mdi-ray-start</v-icon>
            <strong>未开始</strong>
            <span v-if="upcomingTotal" class="grey--text">
              &nbsp;({{ upcomingTotal }})
            </span>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-divider></v-divider>
          <v-card-text>
            这里是未开始的面试的列表
          </v-card-text>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel hide-actions>
        <v-expansion-panel-header>
          <v-row align="center" no-gutters>
            <v-icon color="orange" class="mr-5">mdi-ray-vertex</v-icon>
            <strong>进行中</strong>
            <span v-if="activeTotal" class="grey--text">
              &nbsp;({{ activeTotal }})
            </span>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-divider></v-divider>
          <v-card-text>
            这里是进行中的面试的列表
          </v-card-text>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel hide-actions>
        <v-expansion-panel-header>
          <v-row align="center" no-gutters>
            <v-icon color="green" class="mr-5">mdi-ray-end</v-icon>
            <strong>已结束</strong>
            <span v-if="endedTotal" class="grey--text">
              &nbsp;({{ endedTotal }})
            </span>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-divider></v-divider>
          <v-card-text>
            这里是已结束的面试的列表
          </v-card-text>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card>
      <v-card-text class="text--primary my-3">
        面试官的面试（高优先级）
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'InterviewManagementInterviewer',
  metaInfo: {
    title: '面试官的面试',
  },
  data() {
    return {
      panel: 0,
      upcomingTotal: 2,
      activeTotal: 3,
      endedTotal: 7,
    };
  },
});
</script>

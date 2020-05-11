<template>
  <div>
    <v-card>
      <v-card-text class="text--primary">
        HR 的已结束的面试（高优先级）
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'InterviewManagementEnded',
  metaInfo: {
    title: '已结束的面试',
  },
});
</script>

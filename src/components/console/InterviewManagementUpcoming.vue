<template>
  <component :is="getUserRoleString"></component>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'InterviewManagementUpcoming',
  metaInfo: {
    title: '未开始的面试',
  },
  components: {
    HR: () => import(/* webpackChunkName: "console-HR" */ '@/components/console/HR/InterviewManagementUpcoming.vue'),
    interviewer: () => import(/* webpackChunkName: "console-interviewer" */ '@/components/console/interviewer/InterviewManagementUpcoming.vue'),
  },
  computed: {
    ...mapGetters(['getUserRoleString']),
  },
});
</script>

<template>
  <component :is="getUserRoleString"></component>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'InterviewManagementActive',
  metaInfo: {
    title: '进行中的面试',
  },
  components: {
    HR: () => import(/* webpackChunkName: "console-HR" */ '@/components/console/HR/InterviewManagementActive.vue'),
    interviewer: () => import(/* webpackChunkName: "console-interviewer" */ '@/components/console/interviewer/InterviewManagementActive.vue'),
  },
  computed: {
    ...mapGetters(['getUserRoleString']),
  },
});
</script>

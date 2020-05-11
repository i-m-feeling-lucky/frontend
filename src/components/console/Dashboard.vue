<template>
  <component :is="getUserRoleString"></component>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'Dashboard',
  metaInfo: {
    title: '仪表盘',
  },
  components: {
    admin: () => import(/* webpackChunkName: "console-admin" */ '@/components/console/admin/Dashboard.vue'),
    HR: () => import(/* webpackChunkName: "console-HR" */ '@/components/console/HR/Dashboard.vue'),
    interviewer: () => import(/* webpackChunkName: "console-interviewer" */ '@/components/console/interviewer/Dashboard.vue'),
  },
  computed: {
    ...mapGetters(['getUserRoleString']),
  },
});
</script>

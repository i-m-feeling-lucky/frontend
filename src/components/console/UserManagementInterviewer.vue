<template>
  <component :is="getUserRoleString"></component>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'UserManagementInterviewer',
  metaInfo: {
    title: '面试官管理',
  },
  components: {
    admin: () => import(/* webpackChunkName: "console-admin" */ '@/components/console/admin/UserManagementInterviewer.vue'),
    HR: () => import(/* webpackChunkName: "console-HR" */ '@/components/console/HR/UserManagementInterviewer.vue'),
  },
  computed: {
    ...mapGetters(['getUserRoleString']),
  },
});
</script>

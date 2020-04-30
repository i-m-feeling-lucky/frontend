<template>
  <component :is="getUserRoleString"></component>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'UserManagementInterviewee',
  components: {
    admin: () => import(/* webpackChunkName: "console-admin" */ '@/components/console/admin/UserManagementInterviewee.vue'),
    HR: () => import(/* webpackChunkName: "console-HR" */ '@/components/console/HR/UserManagementInterviewee.vue'),
  },
  computed: {
    ...mapGetters(['getUserRoleString']),
  },
});
</script>

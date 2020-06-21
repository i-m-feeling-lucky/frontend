<template>
  <v-card max-width="400" class="mx-auto">
    <v-img
      src="@/assets/server-room.jpg"
      height="200px"
      dark
    >
      <v-row>
        <v-col cols="12" class="pl-10 pt-15">
          <v-icon size="70">mdi-card-account-details</v-icon>
        </v-col>
        <v-col cols="12" class="pl-8 pt-0 text-h5">个人信息</v-col>
      </v-row>
    </v-img>

    <v-list two-line>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">mdi-account-circle-outline</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ chineseRole }}</v-list-item-title>
          <v-list-item-subtitle>身份</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">mdi-email-outline</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ getUser.email }}</v-list-item-title>
          <v-list-item-subtitle>注册邮箱</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'Profile',
  metaInfo: {
    title: '个人信息',
  },
  computed: {
    ...mapGetters(['getUser']),
    chineseRole() {
      const translation = ['管理员', 'HR', '面试官'];
      return translation[this.getUser.role];
    },
  },
});
</script>

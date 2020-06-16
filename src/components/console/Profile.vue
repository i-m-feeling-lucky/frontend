<template>
  <div>
    <v-card
      max-width="500"
      class="mx-auto"
    >
      <v-img
        src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
        height="200px"
        dark
      >
        <v-row align="end" class="fill-height">
          <v-col class="py-8">
            <div class="text-h5 px-5">个人信息</div>
          </v-col>
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
  </div>
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

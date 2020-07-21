<template>
  <v-navigation-drawer v-model="localDrawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
    <v-list shaped>
      <template v-for="item in consoleItems[role]">
        <v-row v-if="item.heading" :key="item.heading">
          <v-col cols="6">
            <v-subheader>
              {{ item.heading }}
            </v-subheader>
          </v-col>
        </v-row>
        <v-list-group
          v-else-if="item.children"
          :key="item.text"
          v-model="item.model"
          :prepend-icon="item.icon"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="(child, index) in item.children"
            :key="index"
            :to="child.to"
            exact
            link
          >
            <v-list-item-action v-if="child.icon">
              <v-badge
                :content="child.badge"
                :value="child.badge!==undefined"
                color="red"
                overlap
              >
                <v-icon>{{ child.icon }}</v-icon>
              </v-badge>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ child.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item
          v-else
          :key="item.text"
          :to="item.to"
          v-on="item.logout ? { click: onLogout } : {}"
          exact
          link
        >
          <v-list-item-action>
            <v-badge
              :content="item.badge"
              :value="item.badge!==undefined"
              color="red"
              overlap
            >
              <v-icon>{{ item.icon }}</v-icon>
            </v-badge>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapMutations, mapActions } from 'vuex';

export default Vue.extend({
  name: 'Drawer',
  props: ['role', 'value'],
  data() {
    return {
      localDrawer: this.value,
      consoleItems: {
        admin: [
          { heading: '业务管理' },
          {
            icon: 'mdi-view-dashboard',
            text: '仪表盘',
            to: '/console',
          },
          {
            icon: 'mdi-account-box-multiple',
            text: '用户管理',
            model: false,
            children: [
              {
                icon: 'mdi-duck',
                text: 'HR',
                to: '/console/user-management/HR',
              },
              {
                icon: 'mdi-duck',
                text: '面试官',
                to: '/console/user-management/interviewer',
              },
              {
                icon: 'mdi-duck',
                text: '候选人',
                to: '/console/user-management/interviewee',
              },
            ],
          },
          {
            icon: 'mdi-code-greater-than',
            text: '题库管理',
            to: '/console/problem-management',
          },
          { heading: '其他' },
          {
            icon: 'mdi-bell',
            text: '通知',
            to: '/console/notification',
            badge: 42,
          },
          {
            icon: 'mdi-card-account-details',
            text: '个人信息',
            to: '/console/profile',
          },
          {
            icon: 'mdi-shield-key',
            text: '密码修改',
            to: '/console/password',
          },
          {
            icon: 'mdi-logout',
            text: '退出',
            logout: true,
          },
        ],
        HR: [
          { heading: '业务管理' },
          {
            icon: 'mdi-view-dashboard',
            text: '仪表盘',
            to: '/console',
          },
          {
            icon: 'mdi-account-box-multiple',
            text: '用户管理',
            model: false,
            children: [
              {
                icon: 'mdi-duck',
                text: '面试官',
                to: '/console/user-management/interviewer',
              },
              {
                icon: 'mdi-duck',
                text: '候选人',
                to: '/console/user-management/interviewee',
              },
            ],
          },
          {
            icon: 'mdi-account-tie',
            text: '面试管理',
            to: '/console/interview-management-HR',
          },
          { heading: '其他' },
          {
            icon: 'mdi-bell',
            text: '通知',
            to: '/console/notification',
            badge: '99+',
          },
          {
            icon: 'mdi-card-account-details',
            text: '个人信息',
            to: '/console/profile',
          },
          {
            icon: 'mdi-shield-key',
            text: '密码修改',
            to: '/console/password',
          },
          {
            icon: 'mdi-logout',
            text: '退出',
            logout: true,
          },
        ],
        interviewer: [
          { heading: '业务管理' },
          {
            icon: 'mdi-view-dashboard',
            text: '仪表盘',
            to: '/console',
          },
          {
            icon: 'mdi-account-tie',
            text: '面试管理',
            to: '/console/interview-management-interviewer',
          },
          {
            icon: 'mdi-clock',
            text: '空闲时间管理',
            to: '/console/free-time',
          },
          { heading: '其他' },
          {
            icon: 'mdi-bell',
            text: '通知',
            to: '/console/notification',
            badge: 23,
          },
          {
            icon: 'mdi-card-account-details',
            text: '个人信息',
            to: '/console/profile',
          },
          {
            icon: 'mdi-shield-key',
            text: '密码修改',
            to: '/console/password',
          },
          {
            icon: 'mdi-logout',
            text: '退出',
            logout: true,
          },
        ],
      },
    };
  },
  watch: {
    value() {
      this.localDrawer = this.value;
    },
    localDrawer() {
      this.$emit('input', this.localDrawer);
    },
  },
  methods: {
    ...mapMutations(['setError', 'setFullScreen']),
    ...mapActions(['logout']),
    onLogout() {
      this.logout()
        .then(() => {
          if (document.exitFullscreen !== undefined
            && document.fullscreenElement !== undefined
            && document.fullscreenElement !== null) {
            document.exitFullscreen();
            this.setFullScreen(false);
          }
          this.$router.push({ path: '/login' });
        })
        .catch((error) => {
          this.setError(error.message);
        });
    },
  },
});
</script>

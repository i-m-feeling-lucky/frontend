<template>
  <v-app>
    <NavigationDrawer :items="consoleItems[getUserRoleString]" v-model="drawer"/>
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">LOGO 在线面试</span>
      </v-toolbar-title>
      <v-text-field
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="搜索..."
        class="hidden-sm-and-down"
      />
      <v-spacer />
      <v-toolbar-items>
        <v-btn icon @click="toggleFullscreen">
          <v-icon v-if="inFullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>
        <v-menu
          offset-y
          origin="center center"
          class="elelvation-1"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on }">
            <v-btn icon text slot="activator" v-on="on">
              <v-badge color="red" overlap>
                <span slot="badge">3</span>
                <v-icon medium>mdi-bell</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <ToolbarNotificationList />
        </v-menu>
        <v-menu offset-y origin="center center" transition="scale-transition">
          <template v-slot:activator="{ on }">
            <v-btn icon large text slot="activator" v-on="on">
              <v-avatar><v-icon>mdi-account-circle</v-icon> </v-avatar>
            </v-btn>
          </template>
          <v-list class="pa-0">
            <v-list-item
              v-for="(item, index) in userListItems"
              v-on="item.click ? { click: item.click } : {}"
              :to="item.to"
              :key="index"
            >
              <v-list-item-action v-if="item.icon">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <!-- TODO -->
        <v-alert type="error" v-if="getError !== ''">
          {{ getError }}
        </v-alert>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import NavigationDrawer from '@/components/console/NavigationDrawer.vue';
import ToolbarNotificationList from '@/components/console/ToolbarNotificationList.vue';

export default Vue.extend({
  name: 'Console',
  components: {
    NavigationDrawer,
    ToolbarNotificationList,
  },
  computed: {
    ...mapGetters(['logged', 'getUserRoleString', 'getError']),
  },
  data() {
    return {
      // Using null to initialize the drawer
      // as closed on mobile and as open on desktop
      drawer: null,
      inFullscreen: false,
      consoleItems: {
        admin: [
          { heading: '业务管理' },
          {
            icon: 'mdi-view-dashboard',
            text: '首页',
            to: '/console',
          },
          {
            icon: 'mdi-account-box-multiple',
            text: '用户管理',
            model: true,
            children: [
              { icon: 'mdi-duck', text: 'HR', to: '/console/user-management/HR' },
              { icon: 'mdi-duck', text: '面试官', to: '/console/user-management/interviewer' },
              { icon: 'mdi-duck', text: '候选人', to: '/console/user-management/interviewee' },
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
          },
          {
            icon: 'mdi-account',
            text: '个人信息',
            to: '/console/profile',
          },
          {
            icon: 'mdi-settings',
            text: '密码修改',
            to: '/console/password',
          },
        ],
        HR: [
          { heading: '业务管理' },
          {
            icon: 'mdi-view-dashboard',
            text: '首页',
            to: '/console',
          },
          {
            icon: 'mdi-account-box-multiple',
            text: '用户管理',
            model: true,
            children: [
              { icon: 'mdi-duck', text: '面试官', to: '/console/user-management/interviewer' },
              { icon: 'mdi-duck', text: '候选人', to: '/console/user-management/interviewee' },
            ],
          },
          {
            icon: 'mdi-duck',
            text: '面试管理',
            model: true,
            children: [
              { icon: 'mdi-ray-start', text: '未开始', to: '/console/interview-management/upcoming' },
              { icon: 'mdi-ray-vertex', text: '正在进行', to: '/console/interview-management/active' },
              { icon: 'mdi-ray-end', text: '已结束', to: '/console/interview-management/ended' },
            ],
          },
          { heading: '其他' },
          {
            icon: 'mdi-bell',
            text: '通知',
            to: '/console/notification',
          },
          {
            icon: 'mdi-account',
            text: '个人信息',
            to: '/console/profile',
          },
          {
            icon: 'mdi-settings',
            text: '密码修改',
            to: '/console/password',
          },
        ],
        interviewer: [
          { heading: '业务管理' },
          {
            icon: 'mdi-view-dashboard',
            text: '首页',
            to: '/console',
          },
          {
            icon: 'mdi-duck',
            text: '面试管理',
            model: true,
            children: [
              { icon: 'mdi-ray-start', text: '未开始', to: '/console/interview-management/upcoming' },
              { icon: 'mdi-ray-vertex', text: '正在进行', to: '/console/interview-management/active' },
            ],
          },
          { heading: '其他' },
          {
            icon: 'mdi-bell',
            text: '通知',
            to: '/console/notification',
          },
          {
            icon: 'mdi-account',
            text: '个人信息',
            to: '/console/profile',
          },
          {
            icon: 'mdi-clock',
            text: '空闲时间修改',
            to: '/console/free-time',
          },
          {
            icon: 'mdi-settings',
            text: '密码修改',
            to: '/console/password',
          },
        ],
      },
      userListItems: [
        {
          icon: 'mdi-account',
          title: '个人信息',
          to: '/console/profile',
        },
        {
          icon: 'mdi-logout',
          title: '退出',
          click: (this as any).onLogout, // TODO
        },
      ],
    };
  },
  methods: {
    ...mapMutations(['setError']),
    ...mapActions(['logout']),
    onLogout() {
      this.logout()
        .then(() => {
          this.$router.push({ path: '/login' });
        })
        .catch((error) => {
          this.setError(error.message);
        });
    },
    toggleFullscreen() {
      if (document.fullscreenElement !== null) {
        document.exitFullscreen();
        this.inFullscreen = false;
      } else {
        document.documentElement.requestFullscreen();
        this.inFullscreen = true;
      }
    },
  },
  created() {
    if (!this.logged) {
      this.$router.push({ path: '/login' });
      this.setError('您还没有登录');
    }
  },
});
</script>

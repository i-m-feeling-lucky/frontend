<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list>
        <template v-for="item in consoleItems[roleMap[getUser.role]]">
          <v-row v-if="item.heading" :key="item.heading" align="center">
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

            <v-list-item v-for="(child, i) in item.children" :key="i" link>
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else :key="item.text" link>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
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
          <ConsoleNotificationList></ConsoleNotificationList>
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
              @click="item.click"
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
        <v-alert type="error" v-if="getError !== ''">
          {{ getError }}
        </v-alert>
        <p>
          当前用户
          <br />
          {{ getUser }}
        </p>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import mixin from '@/mixin';
import ConsoleNotificationList from '@/components/ConsoleNotificationList.vue';

export default Vue.extend({
  name: 'Console',
  mixins: [mixin],
  components: {
    ConsoleNotificationList,
  },
  computed: {
    ...mapGetters(['logged', 'getUser', 'getError']),
  },
  data() {
    return {
      drawer: null,
      inFullscreen: false,
      consoleItems: {
        admin: [
          { heading: '业务管理' },
          {
            // Click 用户管理 to show all users
            // Click a user type to show specific type user
            icon: 'mdi-account-box-multiple',
            text: '用户管理',
            model: true,
            children: [
              { icon: 'mdi-duck', text: 'HR' },
              { icon: 'mdi-duck', text: '面试官' },
              { icon: 'mdi-duck', text: '候选人' },
            ],
          },
          {
            icon: 'mdi-code-greater-than',
            text: '题库管理',
          },
          { heading: '其他' },
          {
            icon: 'mdi-bell',
            text: '通知',
          },
          {
            icon: 'mdi-account',
            text: '个人信息',
          },
          {
            icon: 'mdi-settings',
            text: '密码修改',
          },
        ],
        HR: [
          { heading: '业务管理' },
          {
            // Click 面试管理 to show all interviews
            // Click a specific type to show that type
            icon: 'mdi-duck',
            text: '面试管理',
            model: true,
            children: [
              { icon: 'mdi-ray-start', text: '未开始' },
              { icon: 'mdi-ray-vertex', text: '正在进行' },
              { icon: 'mdi-ray-end', text: '已结束' },
            ],
          },
          {
            icon: 'mdi-duck',
            text: '我的面试官',
          },
          {
            icon: 'mdi-duck',
            text: '我的候选人',
          },
          { heading: '其他' },
          {
            icon: 'mdi-bell',
            text: '通知',
          },
          {
            icon: 'mdi-account',
            text: '个人信息',
          },
          {
            icon: 'mdi-settings',
            text: '密码修改',
          },
        ],
        interviewer: [
          { heading: '业务管理' },
          {
            // Click 面试管理 to show all interviews
            // Click a specific type to show that type
            icon: 'mdi-duck',
            text: '面试管理',
            model: true,
            children: [
              { icon: 'mdi-ray-start', text: '未开始' },
              { icon: 'mdi-ray-vertex', text: '正在进行' },
              { icon: 'mdi-ray-end', text: '已结束' },
            ],
          },
          { heading: '其他' },
          {
            icon: 'mdi-bell',
            text: '通知',
          },
          {
            icon: 'mdi-account',
            text: '个人信息',
          },
          {
            icon: 'mdi-clock',
            text: '空闲时间修改',
          },
          {
            icon: 'mdi-settings',
            text: '密码修改',
          },
        ],
      },
      userListItems: [
        {
          icon: 'mdi-account',
          title: '个人信息',
          click: '',
        },
        {
          icon: 'mdi-logout',
          title: '退出',
          click: this.onLogout, // TODO ts erroe
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
          this.$router.push({ path: '/' });
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
      this.$router.push({ path: '/' });
      this.setError('您还没有登录');
    }
  },
});
</script>

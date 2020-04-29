<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <template v-for="item in items[role]">
          <v-row v-if="item.heading" :key="item.heading" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col cols="6" class="text-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
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
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="搜索..."
        class="hidden-sm-and-down"
      />
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn icon large>
        <v-avatar item><v-icon>mdi-account-circle</v-icon> </v-avatar>
      </v-btn>
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

export default Vue.extend({
  name: 'Console',
  computed: {
    ...mapGetters(['logged', 'getUser', 'getError']),
  },
  data() {
    return {
      role: 'interviewer',
      drawer: null,
      items: {
        admin: [
          {
            // Click 用户管理 to show all users
            // Click a user type to show specific type user
            icon: 'mdi-account-box',
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
          {
            icon: 'mdi-bell',
            text: '通知',
          },
          {
            icon: 'mdi-settings',
            text: '个人中心',
          },
        ],
        HR: [
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
          {
            icon: 'mdi-bell',
            text: '通知',
          },
          {
            icon: 'mdi-settings',
            text: '密码修改',
          },
        ],
        interviewer: [
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
            icon: 'mdi-bell',
            text: '通知',
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
  },
  mounted() {
    if (!this.logged) {
      this.$router.push({ path: '/' });
      this.setError('您还没有登录');
    }
  },
});
</script>

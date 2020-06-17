<template>
  <v-app>
    <NavigationDrawer
      :role="getUserRoleString"
      v-model="drawer"
    />
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">{{ siteName }}</span>
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
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import NavigationDrawer from '@/components/console/NavigationDrawer.vue';

export default Vue.extend({
  name: 'Console',
  components: {
    NavigationDrawer,
  },
  computed: {
    ...mapGetters(['logged', 'getUserRoleString', 'getError']),
    siteName() {
      return process.env.VUE_APP_SITE_NAME;
    },
  },
  data() {
    return {
      // Using null to initialize the drawer as closed on mobile and as open on desktop
      drawer: null,
      inFullscreen: false,
    };
  },
  methods: {
    ...mapMutations(['setError']),
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

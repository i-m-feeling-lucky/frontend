<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-alert colored-border border="left" type="info" elevation="3">
              测试用户<br/>
              [ { email: 'admin@lucky.com', password: 'admin', },<br/>
              { email: 'hr@lucky.com', password: 'hr', },<br/>
              { email: 'hr2@lucky.com', password: 'hr2', },<br/>
              { email: 'interviewer@lucky.com', password: 'interviewer', }, ]
            </v-alert>
            <v-card class="elevation-12 mb-6">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>登录</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Email"
                    name="email"
                    v-model="email"
                    prepend-icon="mdi-email"
                    type="email"
                    clearable
                  />

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    v-model="password"
                    prepend-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword"
                    clearable
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="onLogin" :loading="loading"
                  >登录</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default Vue.extend({
  name: 'Login',
  metaInfo: {
    title: '登录',
  },
  computed: {
    ...mapGetters(['logged', 'getError']),
  },
  data() {
    return {
      loading: false,
      showPassword: false,
      email: '',
      password: '',
    };
  },
  methods: {
    ...mapMutations(['setError', 'setSuccess']),
    ...mapActions(['login']),
    onLogin() {
      this.loading = true;
      this.login({
        email: this.email,
        password: this.password,
      })
        .then(() => {
          this.$router.push({ path: '/console' });
        })
        .catch((error) => {
          this.setError(error.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  created() {
    if (this.logged) {
      this.setSuccess('已登录~');
      this.$router.push({ path: '/console' });
    }
  },
});
</script>

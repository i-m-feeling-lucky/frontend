<template>
  <v-app>
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-alert icon="mdi-duck">
              测试用户 [ { email: 'admin@lucky.com', name: '高贵的管理员',
              password: 'admin', }, { email: 'hr@lucky.com', name: '我是HR',
              password: 'hr', }, { email: 'hr2@lucky.com', name: '我也是HR',
              password: 'hr', }, { email: 'interviewer@lucky.com', name:
              '面试官苦力', password: 'interviewer', }, ]
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
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="onLogin">登录</v-btn>
              </v-card-actions>
            </v-card>
            <v-alert type="error" v-if="getError !== ''" dismissible="true">
              {{ getError }}
            </v-alert>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default Vue.extend({
  name: 'Home',
  computed: {
    ...mapGetters(['getError']),
  },
  data() {
    return {
      showPassword: false,
      email: '',
      password: '',
    };
  },
  methods: {
    ...mapMutations(['clearError', 'setError']),
    ...mapActions(['login']),
    onLogin() {
      this.clearError();
      this.login({
        email: this.email,
        password: this.password,
      })
        .then(() => {
          this.$router.push({ path: '/console' });
        })
        .catch((error) => {
          this.setError(error.message);
        });
    },
  },
});
</script>

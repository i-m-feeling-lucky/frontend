<template>
  <v-card max-width="600" class="mx-auto">

    <v-img
      src="@/assets/vbanner.jpg"
      height="150"
      class="align-end"
    >
      <v-icon dark size="60" class="ml-7">mdi-shield-key</v-icon>
      <v-card-title class="pt-1 pb-4 text-h5 white--text">密码修改</v-card-title>
    </v-img>

    <v-card-text class="pa-0">
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="10" class="mx-auto py-0">
              <v-text-field
                label="旧密码"
                v-model="oldPassword"
                prepend-icon="mdi-lock"
                :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showOldPassword ? 'text' : 'password'"
                @click:append="showOldPassword = !showOldPassword"
                clearable
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10" class="mx-auto py-0">
              <v-text-field
                label="新密码"
                v-model="newPassword"
                prepend-icon="mdi-lock-open"
                :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showNewPassword ? 'text' : 'password'"
                @click:append="showNewPassword = !showNewPassword"
                clearable
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-row justify="center">
        <v-btn color="primary" @click="onChangePassword">确定</v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapMutations, mapActions } from 'vuex';

export default Vue.extend({
  name: 'ChangePassword',
  metaInfo: {
    title: '密码修改',
  },
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      showOldPassword: false,
      showNewPassword: false,
    };
  },
  methods: {
    ...mapMutations(['setError', 'setSuccess']),
    ...mapActions(['changePassword']),
    onChangePassword() {
      this.changePassword({
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      })
        .then(() => {
          this.setSuccess('密码修改成功');
        })
        .catch((error) => {
          this.setError(error);
        });
    },
  },
});
</script>

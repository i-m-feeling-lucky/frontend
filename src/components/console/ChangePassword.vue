<template>
  <v-card max-width="400" class="mx-auto">

    <v-img
      class="white--text align-end"
      height="70"
      src="@/assets/vbanner.jpg"
    >
      <v-card-title>密码修改</v-card-title>
    </v-img>

    <v-card-text>
      <v-form>
        <v-text-field
          label="旧密码"
          v-model="oldPassword"
          prepend-icon="mdi-lock"
          :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showOldPassword ? 'text' : 'password'"
          @click:append="showOldPassword = !showOldPassword"
          clearable
        />
        <v-text-field
          label="新密码"
          v-model="newPassword"
          prepend-icon="mdi-lock-open"
          :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showNewPassword ? 'text' : 'password'"
          @click:append="showNewPassword = !showNewPassword"
          clearable
        />
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

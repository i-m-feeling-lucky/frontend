<template>
  <div>
    <v-card>
      <v-card-text class="text--primary">
        更改密码（高优先级）
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ChangePassword',
  metaInfo: {
    title: '密码修改',
  },
});
</script>

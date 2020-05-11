<template>
  <div>
    <v-card>
      <v-card-text class="text--primary">
        个人信息（高优先级）
        <br />
        {{ getUser }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'Profile',
  metaInfo: {
    title: '个人信息',
  },
  computed: {
    ...mapGetters(['getUser']),
  },
});
</script>

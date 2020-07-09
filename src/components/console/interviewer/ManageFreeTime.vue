<template>
  <div>
    <v-card>
      <v-card-text class="text--primary">
        面试官显示和更改个人空闲时间（高优先级）<br />
        对空闲时间的约束（暂定）：不能重叠。不能跨日。<br />
        {{getFreeTimeObject}}
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import moment from 'moment';

export default Vue.extend({
  name: 'ManageFreeTime',
  metaInfo: {
    title: '空闲时间管理',
  },
  methods: {
    ...mapMutations(['setError', 'setSuccess']),
    ...mapActions(['getFreeTime']),
  },
  computed: {
    ...mapGetters(['getFreeTimeObject']),
  },
  mounted() {
    this.getFreeTime()
      .catch((error) => {
        this.setError(error);
      });
  },
});
</script>

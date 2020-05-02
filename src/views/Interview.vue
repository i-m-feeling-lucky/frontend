<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <v-alert icon="mdi-duck" class="caption">
          测试房间<br />
          [ { id: 0, HRId: 1, interviewerId: 12, intervieweeId: 18, HRToken: '<a
            href="0?token=1f251805-b4ea-43a3-90a8-299abeb751e8"
            >1f251805-b4ea-43a3-90a8-299abeb751e8</a
          >', interviewerToken: '<a
            href="0?token=60cd9fda-c9b6-4670-b5a5-f6fdb7f9ef6a"
            >60cd9fda-c9b6-4670-b5a5-f6fdb7f9ef6a</a
          >', intervieweeToken: '<a
            href="0?token=563455cd-3111-42e6-9a2a-8f344dd887de"
            >563455cd-3111-42e6-9a2a-8f344dd887de</a
          >', startTime: Date.now() + 1000 * 60 * 24, length: 40, }, { id: 1,
          HRId: 2, interviewerId: 8, intervieweeId: 4, HRToken: '<a
            href="1?token=7e4e8cdf-8c4a-4d60-9305-6ce031e43fbd"
            >7e4e8cdf-8c4a-4d60-9305-6ce031e43fbd</a
          >', interviewerToken: '<a
            href="1?token=bb1105e9-4da7-4097-929f-1ea0f3b1a8df"
            >bb1105e9-4da7-4097-929f-1ea0f3b1a8df</a
          >', intervieweeToken: '<a
            href="1?token=bfe61c90-66b4-4f3f-a3ee-cf6504ce82ed"
            >bfe61c90-66b4-4f3f-a3ee-cf6504ce82ed</a
          >', startTime: Date.now() - 1000 * 60 * 24, length: 35, }, { id: 2,
          HRId: 5, interviewerId: 22, intervieweeId: 11, HRToken: '<a
            href="2?token=141c83b0-294e-4214-89db-09edfc3b2704"
            >141c83b0-294e-4214-89db-09edfc3b2704</a
          >', interviewerToken: '<a
            href="2?token=47fc8855-62fb-45ec-8588-4563a1edd837"
            >47fc8855-62fb-45ec-8588-4563a1edd837</a
          >', intervieweeToken: '<a
            href="2?token=9664eb59-5fff-40a9-ad66-1936d9d06ec6"
            >9664eb59-5fff-40a9-ad66-1936d9d06ec6</a
          >', startTime: Date.now() + 1000 * 60 * 2, length: 40, }, ]
        </v-alert>
      </v-container>
    </v-content>
  </v-app>
</template>


<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import RTCMultiConnection from 'rtcmulticonnection';
import io from 'socket.io-client';
import { dummyVerify } from '@/utils/dummyInterview';
import roleMap from '@/utils/roleMap';

window.io = io;

export default Vue.extend({
  name: 'Interview',

  computed: {
    ...mapGetters(['getError', 'getInfo']),
  },
  methods: {
    ...mapMutations(['setError', 'setInfo']),
    initialInterview(id: number, role: number) {
      const connection = new RTCMultiConnection();
      connection.socketURL = process.env.VUE_APP_RTC_SOCKET_URL;
      connection.session = {
        audio: true,
        video: true,
      };
      window.connection = connection; // TODO for debug only
      if (roleMap[role] === 'HR') {
        this.setInfo('你是 HR，正在旁观中');
        // TODO
        connection.dontAttachStream = true;
        connection.dontCaptureUserMedia = true;
        connection.openOrJoin(id);
        console.log(connection);
      } else if (roleMap[role] === 'interviewer') {
        this.setInfo('你是面试官，请面试');
        connection.openOrJoin(id);
        console.log(connection);
      } else if (roleMap[role] === 'interviewee') {
        this.setInfo('你是候选人，请接受面试');
        connection.openOrJoin(id);
        console.log(connection);
      } else {
        this.setError('系统错误！');
      }
    },
  },

  mounted() {
    const id = +this.$route.params.id;
    const { token } = this.$route.query;
    if (token === undefined) {
      this.setError('无 token，禁止访问！');
      return;
    }
    dummyVerify(id, token as string)
      .then((role) => {
        this.initialInterview(id, role); // TODO permission
      })
      .catch((error) => {
        this.setError(error.message);
      });
  },
});
</script>

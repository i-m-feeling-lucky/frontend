<template>
  <div>
    <h1>Here is the interview page.</h1>
    <p>Valid URL example: /interview/125?token=foobar</p>
    <p>Current interview id: {{ $route.params.id }}</p>
    <p>Current token: {{ $route.query.token }}</p>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import RTCMultiConnection from 'rtcmulticonnection';
import io from 'socket.io-client';

window.io = io;

export default Vue.extend({
  name: 'Interview',

  mounted() {
    const connection = new RTCMultiConnection();
    connection.socketURL = process.env.VUE_APP_RTC_SOCKET_URL;

    connection.session = {
      audio: true,
      video: true,
    };

    connection.openOrJoin('63');
    console.log(connection);
  },
});
</script>

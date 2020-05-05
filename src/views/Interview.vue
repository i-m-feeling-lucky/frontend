<template>
  <v-app>
    <v-content>
      <golden-layout :hasHeaders="false" class="hscreen">
        <gl-row>
          <gl-col>
            <gl-component
              ><codemirror v-model="code" :options="cmOptions" />
            </gl-component>
            <gl-component><div id="drawingboard"></div></gl-component>
          </gl-col>
          <gl-col>
            <gl-row>
              <!-- TODO click to switch between three modes -->
              <gl-component
                ><div
                  id="video-container-interviewer"
                  class="video-container"
                ></div>
              </gl-component>
              <gl-component
                ><div
                  id="video-container-interviewee"
                  class="video-container"
                ></div>
              </gl-component>
            </gl-row>
            <gl-component
              ><Chat
                :participants="participants"
                :myself="myself"
                :messages="messages"
                :placeholder="placeholder"
                :colors="colors"
                :border-style="borderStyle"
                :async-mode="true"
                :scroll-bottom="{
                  messageSent: true,
                  messageReceived: true
                }"
                :display-header="false"
                :send-images="true"
                :profile-picture-config="profilePictureConfig"
                @onImageClicked="onImageClicked"
                @onImageSelected="onImageSelected"
                @onMessageSubmit="onMessageSubmit"
              >
              </Chat>
            </gl-component>
          </gl-col>
        </gl-row>
      </golden-layout>
    </v-content>
  </v-app>
</template>

<script lang="ts">
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable global-require */
import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import RTCMultiConnection from 'rtcmulticonnection';
import io from 'socket.io-client';
import vgl from 'vue-golden-layout';
import { dummyVerify } from '@/utils/dummyInterview';
import roleMap from '@/utils/roleMap';
import toBase64 from '@/utils/toBase64';
import 'codemirror/mode/javascript/javascript'; // TODO
import 'codemirror/theme/base16-dark.css';
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import { Chat } from 'vue-quick-chat';
import 'vue-quick-chat/dist/vue-quick-chat.css';
import 'golden-layout/src/css/goldenlayout-light-theme.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery'; // included using CDN as external librarys
import 'magnific-popup/dist/jquery.magnific-popup';
import 'magnific-popup/dist/magnific-popup.css';
import '@/../public/lib/drawingboard/drawingboard.css';
// eslint-disable-next-line import/no-unresolved
import DrawingBoard from 'drawingboard';

window.io = io; // make it globally available

Vue.use(vgl);

export default Vue.extend({
  name: 'Interview',
  components: {
    codemirror,
    Chat,
  },
  data() {
    return {
      role: -1, // current role
      connection: null as any, // current connection

      code: `[ { id: 0, HRId: 1, interviewerId: 12, intervieweeId: 18, HRToken:
              '<a href="0?token=1f251805-b4ea-43a3-90a8-299abeb751e8"
                >1f251805-b4ea-43a3-90a8-299abeb751e8</a
              >', interviewerToken: '<a
                href="0?token=60cd9fda-c9b6-4670-b5a5-f6fdb7f9ef6a"
                >60cd9fda-c9b6-4670-b5a5-f6fdb7f9ef6a</a
              >', intervieweeToken: '<a
                href="0?token=563455cd-3111-42e6-9a2a-8f344dd887de"
                >563455cd-3111-42e6-9a2a-8f344dd887de</a
              >', startTime: Date.now() + 1000 * 60 * 24, length: 40, }, { id:
              1, HRId: 2, interviewerId: 8, intervieweeId: 4, HRToken: '<a
                href="1?token=7e4e8cdf-8c4a-4d60-9305-6ce031e43fbd"
                >7e4e8cdf-8c4a-4d60-9305-6ce031e43fbd</a
              >', interviewerToken: '<a
                href="1?token=bb1105e9-4da7-4097-929f-1ea0f3b1a8df"
                >bb1105e9-4da7-4097-929f-1ea0f3b1a8df</a
              >', intervieweeToken: '<a
                href="1?token=bfe61c90-66b4-4f3f-a3ee-cf6504ce82ed"
                >bfe61c90-66b4-4f3f-a3ee-cf6504ce82ed</a
              >', startTime: Date.now() - 1000 * 60 * 24, length: 35, },]
            `,
      cmOptions: {
        tabSize: 2,
        mode: 'text/javascript',
        theme: 'base16-dark',
        lineNumbers: true,
        line: true,
      },

      placeholder: '点击编辑你的消息',
      participants: [
        {
          name: '对方',
          id: -1,
          profilePicture: require('@/assets/user.svg'),
        },
      ],
      myself: {
        name: '我',
        id: -1,
        profilePicture: require('@/assets/user.svg'),
      },
      messages: [] as any,
      colors: {
        message: {
          myself: {
            bg: '#fff',
            text: '#666',
          },
          others: {
            bg: '#666',
            text: '#fff',
          },
          messagesDisplay: {
            bg: '#f7f3f3',
          },
        },
        submitIcon: '#666',
        submitImageIcon: '#666',
      },
      borderStyle: {
        topLeft: '0',
        topRight: '0',
        bottomLeft: '0',
        bottomRight: '0',
      },
      profilePictureConfig: {
        others: true,
        myself: true,
        styles: {
          width: '30px',
          height: '30px',
          borderRadius: '50%',
        },
      },
    };
  },
  computed: {
    ...mapGetters(['getError', 'getInfo']),
  },
  methods: {
    ...mapMutations(['setError', 'setInfo']),
    initialInterview(id: number, role: number, password: string) {
      const connection = new RTCMultiConnection();
      // TODO set enableLogs to false
      // TODO stun server
      this.connection = connection; // Assign into global space
      connection.socketURL = process.env.VUE_APP_RTC_SOCKET_URL;
      connection.password = password;
      connection.session = {
        audio: true,
        video: true,
        data: true,
      };
      // TODO mirror video
      connection.videosContainer = {
        interviewer: document.getElementById('video-container-interviewer')!,
        interviewee: document.getElementById('video-container-interviewee')!,
      };
      connection.extra = {
        role,
        createdTime: Date.now(),
      };
      connection.onmessage = (event: any) => {
        if (event.data.chat) {
          this.messages.push(
            Object.assign(event.data.chat, {
              uploaded: true,
              myself:
                // If current user is HR, display interviewer's message on the right
                // by setting `myself` true
                roleMap[role] === 'HR'
                  ? roleMap[event.data.chat.participantId] === 'interviewer'
                  : event.data.chat.participantId === role,
            }),
          );
        }
      };
      (window as any).connection = connection; // TODO for debug only

      if (roleMap[role] === 'HR') {
        this.setInfo('你是 HR，正在旁观中');
        connection.dontCaptureUserMedia = true;
        // TODO currently HR can only get remote stream in the beginning
        connection.onstream = (event: any) => {
          const videoElement = event.mediaElement;
          if (event.type === 'remote') {
            if (
              ['interviewer', 'interviewee'].includes(roleMap[event.extra.role])
            ) {
              const targetElement = connection.videosContainer[roleMap[event.extra.role]];
              targetElement.innerHTML = '';
              targetElement.appendChild(videoElement);
            }
          }
        };
        connection.openOrJoin(id.toString());
      } else if (roleMap[role] === 'interviewer') {
        this.setInfo('你是面试官，请面试');
        connection.onstream = (event: any) => {
          const videoElement = event.mediaElement;
          if (event.type === 'local') {
            const targetElement = connection.videosContainer.interviewer;
            targetElement.innerHTML = '';
            targetElement.appendChild(videoElement);
          } else if (event.type === 'remote') {
            if (event.extra.role === role) {
              if (event.extra.createdTime > connection.extra.createdTime) {
                this.setInfo('您创建了新的连接，此连接断开。');
                this.closeConnection(connection);
              } else {
                this.setInfo('您打开了新连接，旧连接自动断开。');
              }
            } else if (roleMap[event.extra.role] === 'interviewee') {
              const targetElement = connection.videosContainer.interviewee;
              targetElement.innerHTML = '';
              targetElement.appendChild(videoElement);
            }
          }
        };
        connection.openOrJoin(id.toString());
      } else if (roleMap[role] === 'interviewee') {
        this.setInfo('你是候选人，请接受面试');
        connection.onstream = (event: any) => {
          const videoElement = event.mediaElement;
          if (event.type === 'local') {
            const targetElement = connection.videosContainer.interviewee;
            targetElement.innerHTML = '';
            targetElement.appendChild(videoElement);
          } else if (event.type === 'remote') {
            if (event.extra.role === role) {
              if (event.extra.createdTime > connection.extra.createdTime) {
                this.setInfo('您创建了新的连接，此连接断开。');
                this.closeConnection(connection);
              } else {
                this.setInfo('您打开了新连接，旧连接自动断开。');
              }
            } else if (roleMap[event.extra.role] === 'interviewer') {
              const targetElement = connection.videosContainer.interviewer;
              targetElement.innerHTML = '';
              targetElement.appendChild(videoElement);
            }
          }
        };
        connection.openOrJoin(id.toString());
      } else {
        this.setError('系统错误！');
      }
    },
    closeConnection(connection: any) {
      // disconnect with all users
      connection.getAllParticipants().forEach((pid: any) => {
        connection.disconnectWith(pid);
      });
      // stop all local cameras
      connection.attachStreams.forEach((localStream: any) => {
        localStream.stop();
      });
      // close socket.io connection
      connection.closeSocket();
    },

    onMessageSubmit(message: any) {
      if (message.content.trim() === '') {
        this.setError('不能发送空消息');
        return;
      }
      if (this.connection === null) {
        this.setError('未建立连接，信息无法发送！');
        return;
      }
      if (this.connection.socket === null) {
        this.setError('连接已断开，信息无法发送！请在新打开的窗口中执行操作！');
        return;
      }
      this.messages.push(message);
      this.connection.send({ chat: message });
      // TODO send to backend history
      setTimeout(() => {
        message.uploaded = true;
      }, 2000);
    },
    onImageSelected({ file, message }: any) {
      if (this.connection === null) {
        this.setError('未建立连接，信息无法发送！');
        return;
      }
      if (this.connection.socket === null) {
        this.setError('连接已断开，信息无法发送！请在新打开的窗口中执行操作！');
        return;
      }
      // TODO use img.yusanshi.com/upload.php
      toBase64(file)
        .then((base64) => {
          message.src = base64;
          this.messages.push(message);
          this.connection.send({ chat: message });
          // TODO send to backend history
          setTimeout(() => {
            message.uploaded = true;
          }, 2000);
        })
        .catch((error) => {
          this.setError(error.message);
        });
    },
    onImageClicked(message: any) {
      (jQuery as any).magnificPopup.open({
        items: {
          src: message.src,
        },
        type: 'image',
      });
    },
  },

  mounted() {
    const drawingboard = new DrawingBoard.Board('drawingboard', {
      webStorage: false,
    });

    const id = +this.$route.params.id;
    const { token } = this.$route.query;
    if (token === undefined) {
      this.setError('无 token，禁止访问！');
      return;
    }
    // Vefity the token, then initiate the interview
    dummyVerify(id, token as string)
      .then((data) => {
        this.role = data.role;
        const roleString = roleMap[data.role];
        if (roleString === 'interviewee') {
          this.participants[0].name = '面试官'; // TODO real name
          this.participants[0].id = roleMap.indexOf('interviewer');
          this.myself.name = '候选人'; // TODO real name
          this.myself.id = roleMap.indexOf('interviewee');
        } else if (roleString === 'interviewer') {
          this.participants[0].name = '候选人'; // TODO real name
          this.participants[0].id = roleMap.indexOf('interviewee');
          this.myself.name = '面试官'; // TODO real name
          this.myself.id = roleMap.indexOf('interviewer');
        } else if (roleString === 'HR') {
          this.participants[0].name = '候选人'; // TODO real name
          this.participants[0].id = roleMap.indexOf('interviewee');
          this.myself.name = '面试官'; // TODO real name
          this.myself.id = roleMap.indexOf('interviewer');
          this.placeholder = '您只能旁观，不能发送信息';
          document
            .querySelectorAll('.quick-chat-container .container-send-message')
            .forEach((e) => {
              (e as HTMLElement).style.display = 'none';
            });
          document
            .querySelector('.quick-chat-container .message-input')!
            .setAttribute('contenteditable', 'false');
        }
        this.initialInterview(id, data.role, data.password);
      })
      .catch((error) => {
        this.setError(error.message);
      });

    // TODO reorder based on screen size
  },
});
</script>

<style>
.hscreen {
  width: 100vw;
  height: 100vh;
}
.video-container,
video {
  width: 100%;
  height: 100%;
}
.quick-chat-container .message-content {
  width: 100%;
}

#drawingboard {
  width: 960px;
  height: 540px;
}
</style>

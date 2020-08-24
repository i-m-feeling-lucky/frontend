<template>
  <!-- eslint-disable max-len -->
  <v-app>
    <v-main>
      <golden-layout :hasHeaders="false" class="hscreen">
        <gl-row>
          <gl-col>
            <gl-component>
              <codemirror v-model="code.data.text" :options="cmOptions" />
            </gl-component>
            <!-- TODO -->
            <gl-component>
              <v-row class="ml-2 mt-2 mr-0">
                <v-col>
                  <v-select
                    v-model="code.data.timeLimit"
                    :items="supportedTimeLimits"
                    label="时间限制"
                    :dense="true"
                    :readonly="roleString == 'interviewee' || inReplayMode"
                  ></v-select>
                </v-col>
                <v-col>
                  <v-select
                    v-model="code.data.memoryLimit"
                    :items="supportedMemoryLimits"
                    label="内存限制"
                    :dense="true"
                    :readonly="roleString == 'interviewee' || inReplayMode"
                  ></v-select>
                </v-col>
                <v-col>
                  <v-select
                    v-model="code.data.lang"
                    :items="supportedLangs"
                    label="语言"
                    :dense="true"
                    :readonly="inReplayMode"
                  ></v-select>
                </v-col>
                <v-col>
                  <v-btn @click="runCode" :disabled="inReplayMode">运行</v-btn>
                  <!-- TODO float to right -->
                </v-col>
              </v-row>
              <v-row class="ml-2 mr-0">
                <v-col>
                  <v-textarea
                    name="input"
                    label="输入"
                    :filled="true"
                    rows="3"
                    v-model="code.data.input"
                    :readonly="inReplayMode"
                  ></v-textarea>
                </v-col>
                <v-col>
                  <v-textarea
                    name="output"
                    label="输出"
                    :filled="true"
                    rows="3"
                    v-model="code.data.output"
                    :readonly="true"
                  ></v-textarea>
                </v-col>
              </v-row>
            </gl-component>

            <gl-component>
              <DrawingBoard v-model="drawing.data" :readonly="inReplayMode" />
            </gl-component>
          </gl-col>
          <gl-col>
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
            <gl-row>
              <!-- TODO click to switch between three modes -->
              <gl-component>
                <div id="video-container-interviewer" class="video-container"></div>
              </gl-component>
              <gl-component
                ><div id="video-container-interviewee" class="video-container"></div>
              </gl-component>
            </gl-row>
          </gl-col>
        </gl-row>
      </golden-layout>
      <v-dialog v-model="scoreDialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">面试评价</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  评级<v-rating :hover="true" v-model="evaluation.rate"></v-rating>
                </v-col>
                <v-col cols="12">
                  评语<v-textarea v-model="evaluation.comment" rows="3"></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="submitEvaluation">提交评价</v-btn>
            <v-btn color="blue darken-1" text @click="submitEvaluationAndFinish"
              >提交评价并结束面试</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="infoDialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">面试信息</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field :value="interviewInfo.id" label="面试 ID" readonly></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    :value="statusMap[interviewInfo.status]"
                    label="面试状态"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    :value="new Date(interviewInfo.start_time * 1000).toLocaleString('zh-cn')"
                    label="开始时间"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    :value="`${interviewInfo.length} 分钟`"
                    label="面试时长"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    :value="interviewInfo.interviewee"
                    label="面试者"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="replayHelpDialog" max-width="400px">
        <v-card>
          <v-card-title class="headline ">
            回放帮助
          </v-card-title>
          <v-card-text>
            按住空格键以显示当前进度；<br />
            按 <code>←</code> 后退 10 秒；<br />
            按 <code>→</code> 前进 10 秒；<br />
            按 <code>Ctrl + ←</code> 后退 60 秒；<br />
            按 <code>Ctrl + →</code> 前进 60 秒。<br />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="replayHelpDialog = false">知道啦</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-speed-dial v-model="fab" bottom right fixed direction="top">
        <template v-slot:activator>
          <v-btn v-model="fab" color="blue darken-2" dark fab>
            <v-icon v-if="fab">mdi-close</v-icon>
            <v-icon v-else>mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>
        <v-btn
          fab
          dark
          small
          color="indigo"
          @click.stop="scoreDialog = true"
          v-if="roleString === 'interviewer'"
        >
          <v-icon>mdi-star</v-icon>
        </v-btn>
        <v-btn fab dark small color="red" @click.stop="infoDialog = true">
          <v-icon>mdi-information-outline</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          color="green"
          @click.stop="replayHelpDialog = true"
          v-if="inReplayMode"
        >
          <v-icon>mdi-help-circle-outline</v-icon>
        </v-btn>
      </v-speed-dial>

      <v-overlay :value="progressOverlay" z-index="20" opacity="0.7">
        <div class="text-h2 font-weight-bold">
          {{ second2MMSS(replayProgress.current) }} / {{ second2MMSS(replayProgress.total) }}
        </div>
      </v-overlay>
      <v-overlay :value="notStartedOverlay" z-index="20" opacity="0.7">
        <div class="text-h3 font-weight-bold">
          面试将于 {{ new Date(interviewInfo.start_time * 1000).toLocaleString("zh-cn") }} 开始，请耐心等待
        </div>
      </v-overlay>
      <v-overlay :value="finishOverlay" z-index="20" opacity="0.7">
        <div class="text-h3 font-weight-bold">面试已经结束</div>
      </v-overlay>
    </v-main>
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
import roleMap from '@/utils/roleMap';
import toBase64 from '@/utils/toBase64';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/python/python';
import 'codemirror/theme/base16-dark.css';
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/display/autorefresh';
import { Chat } from 'vue-quick-chat';
import 'vue-quick-chat/dist/vue-quick-chat.css';
import 'golden-layout/src/css/goldenlayout-light-theme.css';
import jQuery from 'jquery';
import 'magnific-popup/dist/jquery.magnific-popup';
import 'magnific-popup/dist/magnific-popup.css';
import DrawingBoard from '@/components/interview/DrawingBoard.vue';
import axios from 'axios';

window.io = io; // make it globally available

Vue.use(vgl);

const API_URL = process.env.VUE_APP_API_URL;

export default Vue.extend({
  name: 'Interview',
  // TODO room id and interviewee name
  metaInfo: {
    title: '面试房间',
  },
  components: {
    codemirror,
    Chat,
    DrawingBoard,
  },
  data() {
    return {
      role: -1, // current role
      id: -1, // current interview id
      token: '', // current user's token
      password: '', // password for connection
      connection: null as any, // current connection

      codeStopWatch: false,
      drawingStopWatch: false,

      supportedLangs: [
        {
          text: 'C',
          value: 'c',
        },
        {
          text: 'C++',
          value: 'cpp',
        },
        {
          text: 'Python3',
          value: 'python',
        },
      ],

      supportedTimeLimits: [
        {
          text: '10ms',
          value: '10',
        },
        {
          text: '100ms',
          value: '100',
        },
        {
          text: '1000ms',
          value: '1000',
        },
      ],
      supportedMemoryLimits: [
        {
          text: '100KB',
          value: '100',
        },
        {
          text: '1MB',
          value: '1000',
        },
        {
          text: '10MB',
          value: '10000',
        },
      ],
      code: {
        time: Date.now(),
        data: {
          lang: 'c',
          timeLimit: '100',
          memoryLimit: '100',
          input: '',
          output: '',
          text: `// A weird HelloWorld in C
// https://codegolf.stackexchange.com/a/22596
#include <stdio.h>
int main() {
  long long P = 1,
            E = 2,
            T = 5,
            A = 61,
            L = 251,
            N = 3659,
            R = 271173410,
            G = 1479296389,
            x[] = { G * R * E * E * T , P * L * A * N * E * T };
  puts((char*)x);
}`,
        },
      },

      drawing: {
        time: Date.now(),
        data: {},
      },

      cmOptions: {
        tabSize: 2,
        mode: 'text/x-csrc',
        theme: 'base16-dark',
        lineNumbers: true,
        line: true,
        styleActiveLine: true,
        styleSelectedText: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        autoRefresh: true,
        readOnly: false,
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
            bg: '#eee',
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

      scoreDialog: false,
      infoDialog: false,
      replayHelpDialog: false,
      evaluation: {
        rate: 0,
        comment: '',
      },
      fab: false,
      interviewInfo: {
        id: 0,
        hr: 0,
        interviewer: 0,
        interviewee: 'unknown@lucky.com',
        // eslint-disable-next-line @typescript-eslint/camelcase
        start_time: 0, // UTC timestamp
        length: 30, // minutes
        status: 'unknown',
      },
      statusMap: {
        upcoming: '未开始',
        active: '正在进行',
        ended: '已结束',
      },
      progressOverlay: false,
      notStartedOverlay: false,
      finishOverlay: false,
      replayProgress: {
        current: 0,
        total: 45 * 60, // TODO
      },
      progressTimeoutID: 0,
      isCtrlPressed: false,
      replayData: {
        chat: [],
        whiteboard: [],
        code: [],
      },
      // Use which value in replayData
      replayIndex: {
        chat: 0,
        whiteboard: 0,
        code: 0,
      },
    };
  },
  computed: {
    ...mapGetters(['getError', 'getInfo']),
    roleString(): string {
      return roleMap[this.role];
    },
    inReplayMode(): boolean {
      return this.roleString === 'HR' && this.interviewInfo.status === 'ended';
    },
  },
  methods: {
    ...mapMutations(['setError', 'setInfo']),
    resumeInterview() {
      // Restore chat, drawingboard and code history
      axios
        .get(`${API_URL}/interview/${this.id}/history/chat?scope=all`, {
          headers: { 'X-Token': this.token },
        })
        .then((response) => {
          console.log(response.data);
          this.messages = response.data.map((m: any) => ({
            ...m.data,
            myself:
                // If current user is HR, display interviewer's message on the right
                // by setting `myself` true
                this.roleString === 'HR'
                  ? roleMap[m.data.participantId] === 'interviewer'
                  : m.data.participantId === this.role,
            timestamp: new Date(m.time).toISOString(),
          }));
        })
        .catch((error) => {
          console.log('Resume error');
          if (error.response && error.response.data.message) {
            this.setError(error.response.data.message);
          } else {
            this.setError(error.message);
          }
        });
      axios
        .get(`${API_URL}/interview/${this.id}/history/whiteboard?scope=latest`, {
          headers: { 'X-Token': this.token },
        })
        .then((response) => {
          if (response.data.length !== 0) {
            [this.drawing] = response.data;
          }
        })
        .catch((error) => {
          if (error.response && error.response.data.message) {
            this.setError(error.response.data.message);
          } else {
            this.setError(error.message);
          }
        });
      axios
        .get(`${API_URL}/interview/${this.id}/history/code?scope=latest`, {
          headers: { 'X-Token': this.token },
        })
        .then((response) => {
          if (response.data.length !== 0) {
            [this.code] = response.data;
          }
        })
        .catch((error) => {
          if (error.response && error.response.data.message) {
            this.setError(error.response.data.message);
          } else {
            this.setError(error.message);
          }
        });
    },
    initializeInterview() {
      this.connection = new RTCMultiConnection();
      // TODO set enableLogs to false
      // TODO stun server
      this.connection.socketURL = process.env.VUE_APP_RTC_SOCKET_URL;
      this.connection.password = this.password;
      this.connection.session = {
        audio: true,
        video: true,
        data: true,
      };
      this.connection.videosContainer = {
        interviewer: document.getElementById('video-container-interviewer')!,
        interviewee: document.getElementById('video-container-interviewee')!,
      };
      this.connection.extra = {
        role: this.role,
        createdTime: Date.now(),
      };
      this.connection.onmessage = (event: any) => {
        if (event.data.chat) {
          this.messages.push(
            Object.assign(event.data.chat, {
              uploaded: true,
              myself:
                // If current user is HR, display interviewer's message on the right
                // by setting `myself` true
                this.roleString === 'HR'
                  ? roleMap[event.data.chat.participantId] === 'interviewer'
                  : false,
            }),
          );
        } else if (event.data.code) {
          if (event.data.code.time > this.code.time) {
            this.codeStopWatch = true;
            this.code = event.data.code;
          }
        } else if (event.data.drawing) {
          if (event.data.drawing.time > this.drawing.time) {
            this.drawingStopWatch = true;
            this.drawing = event.data.drawing;
          }
        }
      };

      if (this.roleString === 'HR') {
        this.setInfo('你是 HR，正在旁观中');
        this.connection.dontCaptureUserMedia = true;
        // TODO currently HR can only get remote stream in the beginning
        this.connection.onstream = (event: any) => {
          const videoElement = event.mediaElement;
          if (event.type === 'remote') {
            if (['interviewer', 'interviewee'].includes(roleMap[event.extra.role])) {
              const targetElement = this.connection.videosContainer[roleMap[event.extra.role]];
              targetElement.innerHTML = '';
              targetElement.appendChild(videoElement);
            }
          }
        };
        this.connection.openOrJoin(this.id.toString());
      } else if (this.roleString === 'interviewer') {
        this.setInfo('你是面试官，请面试');
        this.connection.onstream = (event: any) => {
          const videoElement = event.mediaElement;
          if (event.type === 'local') {
            const targetElement = this.connection.videosContainer.interviewer;
            targetElement.innerHTML = '';
            targetElement.appendChild(videoElement);
          } else if (event.type === 'remote') {
            if (event.extra.role === this.role) {
              if (event.extra.createdTime > this.connection.extra.createdTime) {
                this.setInfo('您创建了新的连接，此连接断开。');
                this.closeConnection();
              } else {
                this.setInfo('您打开了新连接，旧连接自动断开。');
              }
            } else if (roleMap[event.extra.role] === 'interviewee') {
              const targetElement = this.connection.videosContainer.interviewee;
              targetElement.innerHTML = '';
              targetElement.appendChild(videoElement);
            }
          }
        };
        this.connection.openOrJoin(this.id.toString());
      } else if (this.roleString === 'interviewee') {
        this.setInfo('你是候选人，请接受面试');
        this.connection.onstream = (event: any) => {
          const videoElement = event.mediaElement;
          if (event.type === 'local') {
            const targetElement = this.connection.videosContainer.interviewee;
            targetElement.innerHTML = '';
            targetElement.appendChild(videoElement);
          } else if (event.type === 'remote') {
            if (event.extra.role === this.role) {
              if (event.extra.createdTime > this.connection.extra.createdTime) {
                this.setInfo('您创建了新的连接，此连接断开。');
                this.closeConnection();
              } else {
                this.setInfo('您打开了新连接，旧连接自动断开。');
              }
            } else if (roleMap[event.extra.role] === 'interviewer') {
              const targetElement = this.connection.videosContainer.interviewer;
              targetElement.innerHTML = '';
              targetElement.appendChild(videoElement);
            }
          }
        };
        this.connection.openOrJoin(this.id.toString());
      } else {
        this.setError('系统错误！');
      }
    },

    closeConnection() {
      // disconnect with all users
      this.connection.getAllParticipants().forEach((pid: any) => {
        this.connection.disconnectWith(pid);
      });
      // stop all local cameras
      this.connection.attachStreams.forEach((localStream: any) => {
        localStream.stop();
      });
      // close socket.io connection
      this.connection.closeSocket();
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
      axios
        .post(
          `${API_URL}/interview/${this.id}/history/chat`,
          // Use time in server
          // TODO why myself got lost here?
          { ...message, uploaded: true, timestamp: 0 },
          {
            headers: { 'X-Token': this.token },
          },
        )
        .then(() => {
          message.uploaded = true;
        })
        .catch((error) => {
          if (error.response && error.response.data.message) {
            this.setError(error.response.data.message);
          } else {
            this.setError(error.message);
          }
        });
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
          axios
            .post(
              `${API_URL}/interview/${this.id}/history/chat`,
              // Use time in server
              { ...message, uploaded: true, timestamp: 0 },
              {
                headers: { 'X-Token': this.token },
              },
            )
            .then(() => {
              message.uploaded = true;
            })
            .catch((error) => {
              if (error.response && error.response.data.message) {
                this.setError(error.response.data.message);
              } else {
                this.setError(error.message);
              }
            });
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
    runCode() {
      axios
        .post(`${API_URL}/oj-interface/result`, {
          lang: this.code.data.lang,
          code: this.code.data.text,
          input: this.code.data.input,
        })
        .then((response: any) => {
          this.code.data.output = `[${response.data.message}]\n${response.data.result}`;
          this.setInfo('运行成功');
        })
        .catch((error) => {
          if (error.response && error.response.data.message) {
            this.setError(error.response.data.message);
          } else {
            this.setError(error.message);
          }
        });
    },
    submitEvaluation() {
      if (this.evaluation.rate === 0) {
        this.setError('评级不能为零！');
        return;
      }
      if (this.evaluation.comment === '') {
        this.setError('评语不能为空！');
        return;
      }
      axios
        .put(
          `${API_URL}/interview/${this.id}/evaluation`,
          {
            rate: 5 - this.evaluation.rate, // map 1 2 3 4 5 to 4 3 2 1 0
            comment: this.evaluation.comment,
          },
          {
            headers: { 'X-Token': this.token },
          },
        )
        .then(() => {
          this.scoreDialog = false;
        })
        .catch((error) => {
          if (error.response && error.response.data.message) {
            this.setError(error.response.data.message);
          } else {
            this.setError(error.message);
          }
        });
    },
    setInterviewStatus(status: string) {
      this.interviewInfo.status = status;
      axios
        .put(
          `${API_URL}/interview/${this.id}/status`,
          { status },
          {
            headers: { 'X-Token': this.token },
          },
        )
        .catch((error) => {
          if (error.response && error.response.data.message) {
            this.setError(error.response.data.message);
          } else {
            this.setError(error.message);
          }
        });
    },
    submitEvaluationAndFinish() {
      this.submitEvaluation();
      this.setInterviewStatus('ended');
    },
    getInterviewInfo() {
      return axios
        .get(`${API_URL}/interview/${this.id}`, {
          headers: { 'X-Token': this.token },
        })
        .then((response) => {
          this.interviewInfo = response.data;
        })
        .catch((error) => {
          if (error.response && error.response.data.message) {
            this.setError(error.response.data.message);
          } else {
            this.setError(error.message);
          }
        });
    },
    second2MMSS(seconds: number): string {
      const timeString = new Date(seconds * 1000).toISOString();
      if (seconds <= 60 * 60) {
        return timeString.substr(14, 5);
      }
      return timeString.substr(11, 8);
    },
    initializeReplay() {
      this.setInfo('你是 HR，正在观看回放中');
      window.addEventListener('keydown', (e) => {
        if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
          this.isCtrlPressed = true;
        } else if (e.code === 'Space') {
          this.progressOverlay = true;
        } else if (e.code === 'ArrowLeft') {
          this.replayProgress.current = Math.max(
            0,
            this.replayProgress.current - (this.isCtrlPressed ? 60 : 10),
          );
          this.progressOverlay = true;
          window.clearTimeout(this.progressTimeoutID);
          this.progressTimeoutID = window.setTimeout(() => {
            this.progressOverlay = false;
          }, 1000);
        } else if (e.code === 'ArrowRight') {
          this.replayProgress.current = Math.min(
            this.replayProgress.total,
            this.replayProgress.current + (this.isCtrlPressed ? 60 : 10),
          );
          this.progressOverlay = true;
          window.clearTimeout(this.progressTimeoutID);
          this.progressTimeoutID = window.setTimeout(() => {
            this.progressOverlay = false;
          }, 1000);
        }
      });
      window.addEventListener('keyup', (e) => {
        if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
          this.isCtrlPressed = false;
        } else if (e.code === 'Space') {
          this.progressOverlay = false;
        }
      });
      window.setInterval(() => {
        this.replayProgress.current = Math.min(
          this.replayProgress.total,
          this.replayProgress.current + 1,
        );
      }, 1000);

      axios
        .get(`${API_URL}/interview/${this.id}/history/chat?scope=all`, {
          headers: { 'X-Token': this.token },
        })
        .then((response) => {
          this.replayData.chat = response.data.map((m: any) => ({
            ...m.data,
            myself: roleMap[m.data.participantId] === 'interviewer',
            time: m.time, // for quicker search in replay
            timestamp: new Date(m.time).toISOString(),
          }));
        })
        .catch((error) => {
          if (error.response && error.response.data.message) {
            this.setError(error.response.data.message);
          } else {
            this.setError(error.message);
          }
        });
      axios
        .get(`${API_URL}/interview/${this.id}/history/whiteboard?scope=all`, {
          headers: { 'X-Token': this.token },
        })
        .then((response) => {
          if (response.data.length !== 0) {
            this.replayData.whiteboard = response.data;
          }
        })
        .catch((error) => {
          if (error.response && error.response.data.message) {
            this.setError(error.response.data.message);
          } else {
            this.setError(error.message);
          }
        });
      axios
        .get(`${API_URL}/interview/${this.id}/history/code?scope=all`, {
          headers: { 'X-Token': this.token },
        })
        .then((response) => {
          if (response.data.length !== 0) {
            this.replayData.code = response.data;
          }
        })
        .catch((error) => {
          if (error.response && error.response.data.message) {
            this.setError(error.response.data.message);
          } else {
            this.setError(error.message);
          }
        });
    },
  },

  created() {
    this.id = +this.$route.params.id;
    this.token = this.$route.query.token as string;
    if (this.token === undefined) {
      // The user may be HR, load its access_token as interview token
      const userString = localStorage.getItem('user');
      if (userString !== null) {
        this.token = JSON.parse(userString).token;
      }
    }
    if (this.token === undefined) {
      this.setError('无 token，禁止访问！');
      return;
    }
    // Verify the token, then initialize the interview
    axios
      .get(`${API_URL}/interview/${this.id}/verify`, {
        headers: { 'X-Token': this.token },
      })
      .then((response: any) => {
        this.role = response.data.role;
        this.password = response.data.password;
        if (this.roleString === 'interviewee') {
          this.participants[0].name = '面试官';
          this.participants[0].id = roleMap.indexOf('interviewer');
          this.myself.name = '候选人'; // TODO real name
          this.myself.id = roleMap.indexOf('interviewee');
        } else if (this.roleString === 'interviewer') {
          this.participants[0].name = '候选人'; // TODO real name
          this.participants[0].id = roleMap.indexOf('interviewee');
          this.myself.name = '面试官';
          this.myself.id = roleMap.indexOf('interviewer');
        } else if (this.roleString === 'HR') {
          this.participants[0].name = '候选人'; // TODO real name
          this.participants[0].id = roleMap.indexOf('interviewee');
          this.myself.name = '面试官';
          this.myself.id = roleMap.indexOf('interviewer');
          document
            .querySelectorAll('.quick-chat-container .container-message-manager')
            .forEach((e) => {
              (e as HTMLElement).style.display = 'none';
            });
          document
            .querySelector('.quick-chat-container .message-input')!
            .setAttribute('contenteditable', 'false');
        }
        return this.getInterviewInfo();
      })
      .then(() => {
        // adjust status
        const currentTime = Math.floor(Date.now() / 1000);
        if (this.interviewInfo.start_time < currentTime && this.interviewInfo.status === 'upcoming') {
          if (currentTime < this.interviewInfo.start_time + this.interviewInfo.length * 60) {
            this.setInterviewStatus('active');
          } else {
            this.setInterviewStatus('ended');
          }
        }
        if (this.interviewInfo.status === 'upcoming') {
          this.notStartedOverlay = true;
        } else if (this.interviewInfo.status === 'active') {
          this.resumeInterview(); // TODO
          this.initializeInterview();
        } else if (this.interviewInfo.status === 'ended') {
          if (this.roleString === 'HR') {
            this.cmOptions.readOnly = true;
            this.initializeReplay();
          } else {
            this.finishOverlay = true;
          }
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          this.setError(error.response.data.message);
        } else {
          this.setError(error.message);
        }
      });
  },

  watch: {
    'code.data': {
      deep: true, // true since code contains many things
      handler() {
        if (this.inReplayMode) {
          return;
        }
        if (this.connection === null) {
          this.setError('未建立连接，代码区无法同步！');
          return;
        }
        if (this.connection.socket === null) {
          this.setError('连接已断开，代码区无法同步！请在新打开的窗口中执行操作！');
          return;
        }
        if (!this.codeStopWatch) {
          this.code.time = Date.now();
          this.connection.send({ code: this.code });
          axios
            .post(
              `${API_URL}/interview/${this.id}/history/code`,
              // Use time in server
              this.code.data,
              {
                headers: { 'X-Token': this.token },
              },
            )
            .catch((error) => {
              if (error.response && error.response.data.message) {
                this.setError(error.response.data.message);
              } else {
                this.setError(error.message);
              }
            });
        } else {
          this.codeStopWatch = false;
        }
      },
    },
    'code.data.lang': function (val) {
      if (val === 'c') {
        this.cmOptions.mode = 'text/x-csrc';
      } else if (val === 'cpp') {
        this.cmOptions.mode = 'text/x-c++src';
      } else if (val === 'python') {
        this.cmOptions.mode = 'text/x-python';
      }
    },
    'drawing.data': function () {
      if (this.inReplayMode) {
        return;
      }
      if (this.connection === null) {
        this.setError('未建立连接，绘图无法同步！');
        return;
      }
      if (this.connection.socket === null) {
        this.setError('连接已断开，绘图无法同步！请在新打开的窗口中执行操作！');
        return;
      }
      if (!this.drawingStopWatch) {
        this.drawing.time = Date.now();
        this.connection.send({ drawing: this.drawing });
        axios
          .post(
            `${API_URL}/interview/${this.id}/history/whiteboard`,
            // Use time in server
            this.drawing.data,
            {
              headers: { 'X-Token': this.token },
            },
          )
          .catch((error) => {
            if (error.response && error.response.data.message) {
              this.setError(error.response.data.message);
            } else {
              this.setError(error.message);
            }
          });
      } else {
        this.drawingStopWatch = false;
      }
    },
    'replayProgress.current': function () {
      const currentTime = this.interviewInfo.start_time + this.replayProgress.current;
      console.log(this.replayData);

      while (
        this.replayIndex.chat in this.replayData.chat
        && (this.replayData.chat[this.replayIndex.chat] as any).time < currentTime * 1000
      ) {
        this.replayIndex.chat += 1;
      }
      this.messages = this.replayData.chat.slice(0, this.replayIndex.chat);

      while (
        this.replayIndex.whiteboard in this.replayData.whiteboard
        && (this.replayData.whiteboard[this.replayIndex.whiteboard] as any).time < currentTime * 1000
      ) {
        this.replayIndex.whiteboard += 1;
      }
      this.replayIndex.whiteboard -= 1;
      if (this.replayIndex.whiteboard in this.replayData.whiteboard) {
        this.drawing = this.replayData.whiteboard[this.replayIndex.whiteboard];
      }

      while (
        this.replayIndex.code in this.replayData.code
        && (this.replayData.code[this.replayIndex.code] as any).time < currentTime * 1000
      ) {
        this.replayIndex.code += 1;
      }
      this.replayIndex.code -= 1;
      if (this.replayIndex.code in this.replayData.code) {
        this.code = this.replayData.code[this.replayIndex.code];
      }
    },
  },
});
</script>

<style>
.hscreen {
  width: 100%;
  height: 100%;
}
.video-container,
video {
  width: 100%;
  height: 100%;
}
.quick-chat-container .message-content {
  width: 100%;
}

.quick-chat-container .container-message-manager {
  line-height: 1;
}

.v-application ul {
  padding-left: 0;
}

.vue-codemirror,
.CodeMirror {
  height: 100%;
}

.lm_content {
  background-color: #eee;
}
</style>

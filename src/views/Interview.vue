<template>
  <v-app>
    <v-content>
      <golden-layout :hasHeaders="false" class="hscreen">
        <gl-row>
          <gl-col>
            <gl-component
              ><codemirror v-model="code" :options="cmOptions" />
            </gl-component>
            <gl-component
              >白板 测试房间<br />
              [ { id: 0, HRId: 1, interviewerId: 12, intervieweeId: 18, HRToken:
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
            </gl-component>
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
            <gl-component>聊天</gl-component>
          </gl-col>
        </gl-row>
      </golden-layout>
    </v-content>
  </v-app>
</template>

<script lang="ts">
/* eslint-disable max-len */
import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import RTCMultiConnection from 'rtcmulticonnection';
import io from 'socket.io-client';
import { dummyVerify } from '@/utils/dummyInterview';
import roleMap from '@/utils/roleMap';
import 'codemirror/mode/javascript/javascript'; // TODO
import 'codemirror/theme/base16-dark.css';
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';

window.io = io; // TODO

export default Vue.extend({
  name: 'Interview',
  components: {
    codemirror,
  },
  data() {
    return {
      code: 'const a = 10',
      cmOptions: {
        tabSize: 2,
        mode: 'text/javascript',
        theme: 'base16-dark',
        lineNumbers: true,
        line: true,
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
      connection.socketURL = process.env.VUE_APP_RTC_SOCKET_URL;
      connection.password = password;
      connection.session = {
        audio: true,
        video: true,
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
      (window as any).connection = connection; // TODO for debug only

      if (roleMap[role] === 'HR') {
        this.setInfo('你是 HR，正在旁观中');
        connection.dontCaptureUserMedia = true;
        // TODO currently HR can only get remote stream in the beginning
        connection.onstream = (event: any) => {
          console.log(event);
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
        console.log(connection);
      } else if (roleMap[role] === 'interviewer') {
        this.setInfo('你是面试官，请面试');
        connection.onstream = (event: any) => {
          console.log(event);
          const videoElement = event.mediaElement;
          if (event.type === 'local') {
            const targetElement = connection.videosContainer.interviewer;
            targetElement.innerHTML = '';
            targetElement.appendChild(videoElement);
          } else if (event.type === 'remote') {
            if (event.extra.role === role) {
              if (event.extra.createdTime > connection.extra.createdTime) {
                this.setInfo('您创建了新的链接，此连接断开。');
                this.closeConnection(connection);
              } else {
                this.setInfo('您打开了新链接，旧连接自动断开。');
              }
            } else if (roleMap[event.extra.role] === 'interviewee') {
              const targetElement = connection.videosContainer.interviewee;
              targetElement.innerHTML = '';
              targetElement.appendChild(videoElement);
            }
          }
        };
        connection.openOrJoin(id.toString());
        console.log(connection);
      } else if (roleMap[role] === 'interviewee') {
        this.setInfo('你是候选人，请接受面试');
        connection.onstream = (event: any) => {
          console.log(event);
          const videoElement = event.mediaElement;
          if (event.type === 'local') {
            const targetElement = connection.videosContainer.interviewee;
            targetElement.innerHTML = '';
            targetElement.appendChild(videoElement);
          } else if (event.type === 'remote') {
            if (event.extra.role === role) {
              if (event.extra.createdTime > connection.extra.createdTime) {
                this.setInfo('您创建了新的链接，此连接断开。');
                this.closeConnection(connection);
              } else {
                this.setInfo('您打开了新链接，旧连接自动断开。');
              }
            } else if (roleMap[event.extra.role] === 'interviewer') {
              const targetElement = connection.videosContainer.interviewer;
              targetElement.innerHTML = '';
              targetElement.appendChild(videoElement);
            }
          }
        };
        connection.openOrJoin(id.toString());
        console.log(connection);
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
  },

  mounted() {
    const id = +this.$route.params.id;
    const { token } = this.$route.query;
    if (token === undefined) {
      this.setError('无 token，禁止访问！');
      return;
    }
    dummyVerify(id, token as string)
      .then((data) => {
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
</style>

<style lang="less">
// Credits
// Based on https://github.com/golden-layout/golden-layout/blob/master/src/less/themes/goldenlayout-translucent-theme.less

// Color variables (appears count calculates by raw css)
@color0: #ffffff; // Appears 7 times

@color1: #5555ff; // Appears 1 time
@color2: #000000; // Appears 1 time
@color3: rgb(61, 61, 61); // Appears 1 time
@color4: rgb(0, 0, 0); // Appears 1 time

// ".lm_dragging" is applied to BODY tag during Drag and is also directly applied to the root of the object being dragged

// Entire GoldenLayout Container, if a background is set, it is visible as color of "pane header" and "splitters" (if these latest has opacity very low)
.lm_goldenlayout {
  background: @color3;
  background: linear-gradient(to right bottom, @color3, @color4);
}

// Single Pane content (area in which final dragged content is contained)
.lm_content {
  background: fade(@color0, 10%);
  box-shadow: 0 0 15px 2px fade(@color2, 10%);
  color: whitesmoke;
}

// Single Pane content during Drag (style of moving window following mouse)
.lm_dragProxy {
  .lm_content {
    box-shadow: 2px 2px 4px fade(@color2, 90%);
  }
}

// Placeholder Container of target position
.lm_dropTargetIndicator {
  box-shadow: inset 0 0 20px fade(@color0, 50%);
  outline: 1px dashed @color0;

  // Inner Placeholder (Used in other Themes but actually not here)
  /*.lm_inner
  {
    background:@color0;
    opacity:0.1;
  }*/
}

// Separator line (handle to change pane size)
.lm_splitter {
  background: @color0;
  opacity: 0.001;
  transition: opacity 200ms ease;

  &:hover, // When hovered by mouse...
  &.lm_dragging {
    background: @color0;
    opacity: 0.4;
  }
}

// Pane Header (container of Tabs for each pane)
.lm_header {
  height: 20px;

  // Single Tab container. A single Tab is set for each pane, a group of Tabs are contained in ".lm_header"
  .lm_tab {
    font-family: Arial, sans-serif;
    font-size: 13px;
    color: @color0;
    background: fade(@color0, 10%);
    margin-right: 2px;
    padding-bottom: 4px;

    // Close Tab Icon
    .lm_close_tab {
      width: 11px;
      height: 11px;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAATElEQVR4nG3OwQ0DMQwDwZGRBtR/j1YJzMc5+IDoR+yCVO29g+pu981MFgqZmRdAfU7+CYWcbF11LwALjpBL0N0qybNx/RPU+gOeiS/+XCRwDlTgkQAAAABJRU5ErkJggg==);
      background-position: center center;
      background-repeat: no-repeat;
      right: 6px;
      top: 4px;
      opacity: 0.4;

      &:hover {
        opacity: 1;
      }
    }

    // If Tab is active, so if it's in foreground
    &.lm_active {
      border-bottom: none;
      box-shadow: 2px -2px 2px -2px fade(@color2, 20%);
      padding-bottom: 5px;

      .lm_close_tab {
        opacity: 1;
      }
    }
  }
}

.lm_dragProxy,
.lm_stack {
  &.lm_right {
    .lm_header .lm_tab {
      &.lm_active {
        box-shadow: 2px -2px 2px -2px fade(@color2, 20%);
      }
    }
  }

  &.lm_bottom {
    .lm_header .lm_tab {
      &.lm_active {
        box-shadow: 2px 2px 2px -2px fade(@color2, 20%);
      }
    }
  }
}

// If Pane Header (container of Tabs for each pane) is selected (used only if addition of new Contents is made "by selection" and not "by drag")
.lm_selected {
  // (Used in other Themes but actually not here)
  /*.lm_header
  {
    background-color:@color6;
  }*/
}

.lm_tab {
  &:hover, // If Tab is hovered
  &.lm_active // If Tab is active, so if it's in foreground
 {
    background: fade(@color0, 30%);
    color: @color0;
  }
}

// Dropdown arrow for additional tabs when too many to be displayed
// (Used in other Themes but actually not here)
/*
.lm_header .lm_controls .lm_tabdropdown:before
{
  color:@color1;
}*/

// Pane controls (popout, maximize, minimize, close)
.lm_controls {
  // All Pane controls shares these
  > li {
    position: relative;
    background-position: center center;
    background-repeat: no-repeat;
    opacity: 0.4;
    transition: opacity 300ms ease;

    &:hover {
      opacity: 1;
    }
  }

  // Icon to PopOut Pane, so move it to a different Browser Window
  .lm_popout {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAPklEQVR4nI2Q0QoAIAwCNfr/X7aXCpGN8snBdgejJOzckpkxs9jR6K6T5JpU0nWl5pSXTk7qwh8SnNT+CAAWCgkKFpuSWsUAAAAASUVORK5CYII=);
  }

  // Icon to Maximize Pane, so it will fill the entire GoldenLayout Container
  .lm_maximise {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAKElEQVR4nGP8////fwYCgImQAgYGBgYWKM2IR81/okwajIpgvsMbVgAwgQYRVakEKQAAAABJRU5ErkJggg==);
  }

  // Icon to Close Pane and so remove it from GoldenLayout Container
  .lm_close {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAQUlEQVR4nHXOQQ4AMAgCQeT/f6aXpsGK3jSTuCVJAAr7iBdoAwCKd0nwfaAdHbYERw5b44+E8JoBjEYGMBq5gAYP3usUDu2IvoUAAAAASUVORK5CYII=);
  }

  // Icon to toggle Pane Docking at mouse hover
  .lm_dock {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QQLEyI6TJPB/QAAAXdJREFUOMul08uKE2EQhuGnMj0m4gk1C3Wj4lZRUXDhSsSb0Cvwbty7de0diAvxcBEqiIgndDBRnJlMutzUQJvEJGBB0w1/1ft/VfV1mInM7OMohthAdp4JvkTEaLauMR+HcA83MCpAiyP1/TAzn0dEuwo0xTH8xBNsYROXca3OYx1FLcbYxkt8qMKDOIutiJjOFvUWgHbxqVQ01UIPx0vljwU186CI2KnZDDDMzKhWz5Wy3bVAmXkSJ/YVVU6LnUo5lZkHloIycxNXcAev8SYiphHxHc8KfguHVyka4m5t5hG+ZWZTCl7gKW7j6j+3lpm9ammIr7iOSx1TRsek5zNzEBHbc6CIaDNzUi2dwc0y4emaz+dy9qjefy9pZkZNFTbYw0Xcxys8LsAEv8pP7UJDRsQe3hd0o0w4Ll+9i4jfmRkRkesYch86rYuiYwGLIEtBnfNpQdpVicviIy5gHBGT/wH1S1E/MwfLEpsVoAke4G3nF1kYfwAzNYI/6q7lywAAAABJRU5ErkJggg==);
  }
}

.lm_stack.lm_docked {
  .lm_controls .lm_dock {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QQLExoPDb+5JQAAAKZJREFUOMvV0tENgjAUhWFGYBQ20FG6iYzgBo4gG8gIbAAbyAafD5akwWIATYz3sWn+e/qfFsUvBsevQDzn8gmkRI8a3W4YGjQJdD0MFQ44YUQ5S/geFgF99NFhyEmOz5QtIG4a0aYJMneuSwvmiUaEhebu0Vm51s8LLKaotzY1OQjJWbvpUyJESD0li26g2goJs2feMOyCZJxVuyFp7WvTnJcg/zkPjGQks0ox9/8AAAAASUVORK5CYII=);
  }

  > .lm_items {
    border-color: @color1;
    border-image: linear-gradient(to right, @color1 1%, @color0 100%);
    box-shadow: 2px -2px 2px -2px fade(@color2, 20%);
  }
}

// If a specific Pane is maximized
// (Used in other Themes but actually not here)
/*
.lm_maximised
{
    // Pane Header (container of Tabs for each pane) can have different style when is Maximized
    .lm_header
    {
      background-color:@color4;
    }

    // Pane controls are different in Maximized Mode, especially the old Icon "Maximise" that now has a different meaning, so "Minimize" (even if CSS Class did not change)
    .lm_controls
    {
        .lm_maximise
        {
          background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAJklEQVR4nGP8//8/AyHARFDFUFbEwsDAwMDIyIgzHP7//89IlEkApSkHEScJTKoAAAAASUVORK5CYII=);
        }
    }
}
*/

// (Used in other Themes but actually not here)
/*
.lm_transition_indicator
{
  background-color:@color1;
  border:1px dashed @color5;
}*/

// If a specific Pane is Popped Out, so move it to a different Browser Window, Icon to restore original position is:
.lm_popin {
  cursor: pointer;

  // Background of Icon
  // (Used in other Themes but actually not here)
  /*
  .lm_bg
  {
    background:@color1;
    opacity:0.7;
  }*/

  // Icon to Restore original position in Golden Layout Container
  .lm_icon {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAJCAYAAADpeqZqAAAAWklEQVR4nJWOyw3AIAxDHcQC7L8jbwT3AlJBfNp3SiI7dtRaLSlKKeoA1oEsKSQZCEluexw8Tm3ohk+E7bnOUHUGcNh+HwbBygw4AZ7FN/Lt84p0l+yTflV8AKQyLdcCRJi/AAAAAElFTkSuQmCC);
    background-position: center center;
    background-repeat: no-repeat;
    opacity: 0.7;
  }

  &:hover {
    .lm_icon {
      opacity: 1;
    }
  }
}

// Present only in this Theme

.lm_item {
  box-shadow: 2px 2px 2px fade(@color2, 10%);
}
</style>

<template>
  <div>
    <v-card>
      <v-row class="fill-height">
        <v-col>
          <v-sheet height="64">
            <v-toolbar flat>
              <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
                今天
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon small>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon small>
                  mdi-chevron-right
                </v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-menu bottom right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right>
                      mdi-menu-down
                    </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="type = 'day'">
                    <v-list-item-title>日视图</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'week'">
                    <v-list-item-title>周视图</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'month'">
                    <v-list-item-title>月视图</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </v-sheet>
          <v-sheet height="550">
            <v-calendar
              ref="calendar"
              v-model="focus"
              color="primary"
              :events="events"
              :event-color="getEventColor"
              :type="type"
              @click:event="showEvent"
              @click:more="viewDay"
              @click:date="viewDay"
              @change="updateRange"
              end="2020-07-13"
            ></v-calendar>
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              max-width="64px"
            >
              <v-card color="red lighten-1" flat>
                <v-btn text color="white"
                  :loading="loading" :disabled="loading" @click="deleteEvent">
                  删除
                </v-btn>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>
    <v-card>
      <v-card-text class="text--primary">
        面试官显示和更改个人空闲时间（高优先级）<br />
        对空闲时间的约束：不能重叠<br />
        <br />
        显示空闲时间：<br />
        <br />
        有月视图、周视图，日视图。<br />
        打开页面后默认进入的是含有今天的月视图（即，今天所在的这个月的月视图）。<br />
        在月视图下，点左右箭头是跳到上个月下个月的月视图。<br />
        在周视图下，点左右箭头是跳到上个周下个周的周视图。<br />
        点“今天”按钮，直接跳到今天的日视图。<br />
        <br />
        删除空闲时间：<br />
        点击想要改动的日程。然后点击出现的“删除”按钮来删除这个日程。
        <br />
        添加空闲时间（TODO）：<br />
        点击添加空闲时间按钮，然后在弹出的会话中选择时间，然后点“确定”。
        <br />
        <br />{{getFreeTimeArray}}
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
  data() {
    return {
      init: false,
      focus: '',
      type: 'month', // 视图类型
      typeToLabel: {
        month: '月视图',
        week: '周视图',
        day: '日视图',
        '4day': '4 Days',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [] as any[],
      rangeStartDate: '',
      rangeEndDate: '',
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['getFreeTimeArray']),
  },
  methods: {
    ...mapMutations(['setError', 'setSuccess', 'setFreeTimeArray']),
    ...mapActions(['getFreeTime', 'changeFreeTime']),
    deleteEvent() {
      // 复制一份Vuex的freeTimeArray，从副本中找到与selectedEvent吻合的事件，删除它，然后向后端发送修改后的空闲时间表
      // 如果后端修改成功，那么：提示修改成功。用此副本来更新Vuex的freeTimeArray。用更新后的freeTimeArray重新计算本组件的data的events
      // 如果后端修改失败，那么：提示修改失败。
      this.loading = true;
      const deleteStart = moment((this.selectedEvent as any).start).format().slice(0, 19);
      const temp: string[][] = [];

      for (let i = 0; i < this.getFreeTimeArray.length; i += 1) {
        if (this.getFreeTimeArray[i][0].slice(0, 19) !== deleteStart) {
          temp.push(this.getFreeTimeArray[i]);
        }
      }

      this.changeFreeTime(JSON.stringify(temp))
        .then(() => {
          this.setSuccess('删除空闲时间成功');
          this.setFreeTimeArray(temp);
          this.events = this.pickEvents(this.getFreeTimeArray);
          this.loading = false;
          this.selectedOpen = false;
        })
        .catch((error) => {
          this.setError(error);
          this.loading = false;
          this.selectedOpen = false;
        });
    },
    viewDay(obj: { date: any }) {
      this.focus = obj.date;
      this.type = 'day';
    },
    getEventColor(event: any) {
      return event.color;
    },
    setToday() {
      this.focus = '';
      this.type = 'day';
    },
    prev() {
      (this.$refs.calendar as any).prev();
    },
    next() {
      (this.$refs.calendar as any).next();
    },
    showEvent(obj: { nativeEvent: any, event: any }) {
      const open = () => {
        this.selectedEvent = obj.event;
        this.selectedElement = obj.nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      obj.nativeEvent.stopPropagation();
    },
    pickEvents(freeTime: string[][]) {
      const events: object[] = [];
      for (let i = 0; i < freeTime.length; i += 1) {
        if (freeTime[i][0].slice(0, 10) >= this.rangeStartDate
        && freeTime[i][1].slice(0, 10) <= this.rangeEndDate) {
          events.push({
            name: '空闲时间',
            start: new Date(freeTime[i][0]),
            end: new Date(freeTime[i][1]),
            color: 'green',
            timed: true,
          });
        }
      }
      return events;
    },
    updateRange(obj: { start: any, end: any }) {
      // obj.start.date是显示范围的开始日期，obj.end.date是显示范围的结束日期
      // 从Vuex的freeTimeObject中挑选处于显示范围内的所有事件，放入本组件的data的events中
      this.rangeStartDate = obj.start.date;
      this.rangeEndDate = obj.end.date;
      if (this.init) {
        this.events = this.pickEvents(this.getFreeTimeArray);
      } else {
        this.getFreeTime()
          .catch((error) => {
            this.setError(error);
            this.events = this.pickEvents(this.getFreeTimeArray);
            this.init = true;
          });
      }
    },
  },
});
</script>

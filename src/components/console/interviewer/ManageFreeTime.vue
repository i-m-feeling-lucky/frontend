<template>
  <div>
    <v-card max-width="800" class="mx-auto">
      <v-row class="fill-height">
        <v-col>
          <v-toolbar flat height="50">
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
            <v-toolbar-title v-if="$refs.calendar" class="text-subtitle-1 text-sm-h6 mr-2">
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
                <v-list-item @click="type = 'day';focus = '';">
                  <v-list-item-title>今天</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
          <v-sheet height="450">
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
            ></v-calendar>
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              max-width="64px"
            >
              <v-card color="red lighten-1" flat>
                <v-btn text color="white"
                  :loading="loadingDelete" :disabled="loadingDelete" @click="deleteEvent">
                  删除
                </v-btn>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>
    <v-card max-width="800" class="mx-auto my-3">
      <v-img
        src="@/assets/banner-time.jpg"
        height="150"
        class="align-end"
      >
        <v-icon dark size="60" class="ml-4">mdi-chart-timeline</v-icon>
        <v-card-title class="pt-1 pb-4 text-h5 white--text">添加空闲时间</v-card-title>
      </v-img>

      <v-card-text class="pa-0">
        <v-form v-model="newFreeTimeValid" ref="form">
          <v-container>
            <v-row>
              <v-col cols="10" class="mx-auto py-0">
                <v-menu
                  ref="menu1"
                  v-model="menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="日期"
                      prepend-icon="mdi-calendar"
                      readonly
                      required
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    locale="zh-cn"
                    v-model="date"
                    min="1950-01-01"
                    @change="$refs.menu1.save(date)"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="10" class="mx-auto py-0">
                <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  :return-value.sync="newStartTime"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="newStartTime"
                      label="开始时间"
                      prepend-icon="mdi-clock-time-two-outline"
                      readonly
                      required
                      v-bind="attrs"
                      v-on="on"
                      :rules="newStartTimeRules"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menu2"
                    v-model="newStartTime"
                    full-width
                    @click:minute="$refs.menu2.save(newStartTime)"
                    format="24hr"
                  ></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="10" class="mx-auto py-0">
                <v-menu
                  ref="menu3"
                  v-model="menu3"
                  :close-on-content-click="false"
                  :return-value.sync="newEndTime"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="newEndTime"
                      label="结束时间"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      required
                      v-bind="attrs"
                      v-on="on"
                      :rules="newEndTimeRules"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menu3"
                    v-model="newEndTime"
                    full-width
                    @click:minute="$refs.menu3.save(newEndTime)"
                    format="24hr"
                  ></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    <v-card-actions>
      <v-row justify="center">
        <v-btn color="primary" @click="onAddNewFreeTime"
          :loading="loadingAdd" :disabled="loadingAdd">确定</v-btn>
      </v-row>
    </v-card-actions>
    </v-card>
    <v-card max-width="800" class="mx-auto">
      <v-card-text class="text--primary">
        面试官显示和更改个人空闲时间（高优先级）<br />
        对空闲时间的约束：不能重叠，不能跨日<br />
        <br />
        TODO: 在某些浏览器里，日历里显示的时间比正确值晚8小时的问题<br />
        <br />
        moment(new Date('2000-01-01T10:00:00')).format()<br />{{test1}}<br />
        moment('2000-01-01T10:00:00').format()<br />{{test2}}<br />
        <br />
        getFreeTimeArray<br />{{getFreeTimeArray}}<br />
        this.events<br />{{this.events}}
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
      type: 'month',
      typeToLabel: {
        month: '月视图',
        week: '周视图',
        day: '日视图',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [] as any[],
      rangeStartDate: '',
      rangeEndDate: '',
      loadingDelete: false,
      loadingAdd: false,
      date: moment().format().slice(0, 10),
      newStartTime: '',
      newEndTime: '',

      menu1: false,
      menu2: false,
      menu3: false,

      newFreeTimeValid: false,
      newStartTimeRules: [
        function (startTime: string) {
          return !!startTime || '需要选择开始时间';
        },
      ],

      test1: moment(new Date('2000-01-01T10:00:00')).format(),
      test2: moment('2000-01-01T10:00:00').format(),
    };
  },
  computed: {
    ...mapGetters(['getFreeTimeArray']),
    newEndTimeRules() {
      const newEndTimeRules: any = [(endTime: string) => !!endTime || '需要选择结束时间'];
      if (this.newStartTime !== '') {
        const rule = (endTime: string) => endTime > this.newStartTime || '结束时间必须晚于开始时间';
        newEndTimeRules.push(rule);
      }
      return newEndTimeRules;
    },
    newFreeTimeStart(): string {
      return `${this.date}T${this.newStartTime}`;
    },
    newFreeTimeEnd(): string {
      return `${this.date}T${this.newEndTime}`;
    },
  },
  methods: {
    ...mapMutations(['setError', 'setSuccess', 'setFreeTimeArray']),
    ...mapActions(['getFreeTime', 'changeFreeTime']),
    deleteEvent() {
      // 复制一份Vuex的freeTimeArray，从副本中找到与selectedEvent吻合的事件，删除它，然后向后端发送修改后的空闲时间表
      // 如果后端修改成功，那么提示修改成功。用此副本来更新Vuex的freeTimeArray。用更新后的freeTimeArray重新计算本组件的data的events
      // 如果后端修改失败，那么提示修改失败。
      this.loadingDelete = true;
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
          this.loadingDelete = false;
          this.selectedOpen = false;
        })
        .catch((error) => {
          this.setError(error);
          this.loadingDelete = false;
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
    onAddNewFreeTime() {
      if ((this.$refs.form as any).validate()) {
        this.loadingAdd = true;
        for (let i = 0; i < this.getFreeTimeArray.length; i += 1) {
          if (this.date === this.getFreeTimeArray[i][0].slice(0, 10)
            && (moment(this.newFreeTimeStart).isBetween(this.getFreeTimeArray[i][0], this.getFreeTimeArray[i][1], 'second', '[]')
            || moment(this.newFreeTimeEnd).isBetween(this.getFreeTimeArray[i][0], this.getFreeTimeArray[i][1], 'second', '[]'))) {
            this.setError('与已存在的空闲时间有重叠！');
            this.loadingAdd = false;
            return;
          }
        }
        const temp: string[][] = [];
        for (let i = 0; i < this.getFreeTimeArray.length; i += 1) {
          temp.push(this.getFreeTimeArray[i]);
        }
        temp.push([this.newFreeTimeStart, this.newFreeTimeEnd]);
        this.changeFreeTime(JSON.stringify(temp))
          .then(() => {
            this.setSuccess('添加空闲时间成功');
            this.setFreeTimeArray(temp);
            this.events = this.pickEvents(this.getFreeTimeArray);
            this.loadingAdd = false;
          })
          .catch((error) => {
            this.setError(error);
            this.loadingAdd = false;
          });
      }
    },
  },
});
</script>

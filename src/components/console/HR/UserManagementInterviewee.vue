<template>
 <v-row no-gutters>
    <v-col class="mx-auto" cols="12" sm="10" md="9">

      <v-card class="my-3">
        <v-card-text class="text--primary">
          HR 的候选人管理页面<br />
          <br />
          需要显示所有归此HR管的候选人的列表，其中需要展示（默认按候选人的邮箱字符串来排序）：<br />
          <br />
          邮箱<br />
          此候选人的面试列表 其中每一个面试需要展示：时间、时长、面试官id、评分、评语<br />
          此候选人的申请结果（待定、通过、拒绝。HR可修改!）<br />
          <br />
        </v-card-text>
      </v-card>

      <v-card class="my-3">
        <v-list two-line class="px-sm-4" v-if="interviewees.length">
          <v-list-item
            v-for="item in interviewees"
            :key="item.email"
            @click="intervieweeClicked"
            class="pa-0"
          >
            <v-list-item-avatar>
              <v-icon class="grey lighten-1 white--text">
                mdi-account-tie
              </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                {{item.email}}
              </v-list-item-title>
              <v-list-item-subtitle class="text-subtitle-2">
                <v-chip
                  small
                  color="green lighten-1"
                  text-color="white"
                >
                  <v-icon left size="17">mdi-clock-time-two-outline</v-icon>
                  {{['待定','通过','拒绝'][item.application_result]}}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
            <!--
            <v-list-item-action>
              <v-btn icon>
                <v-icon color="blue lighten-1">mdi-information</v-icon>
              </v-btn>
            </v-list-item-action>
            -->
          </v-list-item>
        </v-list>
        <v-card-text class="text-center text--secondary" v-else>
          无数据~
        </v-card-text>
      </v-card>

      <v-card>
        <v-data-table
          :headers="headers"
          :items="desserts"
          :items-per-page="5"
          class="elevation-1"
        ></v-data-table>
      </v-card>
    </v-col>
 </v-row>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'UserManagementInterviewee',
  metaInfo: {
    title: '候选人管理',
  },
  methods: {
    intervieweeClicked() {
      console.log('interviewee clicked!');
    },
  },
  data() {
    return {
      interviewees: [
        {
          email: 'abc@abc.com',
          // eslint-disable-next-line
          application_result: 0,
        },
        {
          email: 'jackweller@gmail.com',
          // eslint-disable-next-line
          application_result: 0,
        },
        {
          email: 'yusanshi@163.com',
          // eslint-disable-next-line
          application_result: 1,
        },
        {
          email: 'anothertest@gmail.com',
          // eslint-disable-next-line
          application_result: 2,
        },
      ],

      items: [
        { icon: true, title: 'Jason Oner', avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
        { title: 'Travis Howard', avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
        { title: 'Ali Connors', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' },
        { title: 'Cindy Baker', avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg' },
      ],

      headers: [
        {
          text: '面试官',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: '时间', value: 'calories', sortable: false },
        { text: '评分', value: 'fat' },
        { text: 'Carbs', value: 'carbs' },
        { text: 'Protein', value: 'protein' },
        { text: '评价', value: 'iron' },
      ],
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: '7 月 1日',
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '具备良好的人品，乐于与人沟通，生活在群体之中，能够与人进行客观直接的沟通，具有较强的团队管理能力和与人合作的精神，能够积极互动努力达成团队的目标',
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '善于学习，勤奋务实，刻苦钻研，具备广泛的兴趣和很丰富的知识，适应能力强，能够在很段时间内融入一个新的领域，适应他并且把他做好',
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: '7%',
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: '8%',
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%',
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: '0%',
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: '2%',
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: '45%',
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: '22%',
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: '6%',
        },
      ],
    };
  },
});
</script>

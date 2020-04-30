import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Login from '@/views/Login.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/console',
    component: () => import(/* webpackChunkName: "console" */ '@/views/Console.vue'),
    children: [
      {
        // TODO rename all webpackChunkName
        path: '',
        component: () => import(/* webpackChunkName: "console" */ '@/components/console/Dashboard.vue'),
      },
      {
        path: 'user-management/HR',
        component: () => import(/* webpackChunkName: "console-admin" */ '@/components/console/admin/UserManagementHR.vue'),
      },
      {
        path: 'user-management/interviewer',
        component: () => import(/* webpackChunkName: "console" */ '@/components/console/UserManagementInterviewer.vue'),
      },
      {
        path: 'user-management/interviewee',
        component: () => import(/* webpackChunkName: "console" */ '@/components/console/UserManagementInterviewee.vue'),
      },
      {
        path: 'interview-management/upcoming',
        component: () => import(/* webpackChunkName: "console" */ '@/components/console/InterviewManagementUpcoming.vue'),
      },
      {
        path: 'interview-management/active',
        component: () => import(/* webpackChunkName: "console" */ '@/components/console/InterviewManagementActive.vue'),
      },
      {
        path: 'interview-management/ended',
        component: () => import(/* webpackChunkName: "console-HR" */ '@/components/console/HR/InterviewManagementEnded.vue'),
      },
      {
        path: 'problem-management',
        component: () => import(/* webpackChunkName: "console-admin" */ '@/components/console/admin/ProblemManagement.vue'),
      },
      {
        path: 'notification',
        component: () => import(/* webpackChunkName: "console" */ '@/components/console/Notification.vue'),
      },
      {
        path: 'profile',
        component: () => import(/* webpackChunkName: "console" */ '@/components/console/Profile.vue'),
      },
      {
        path: 'password',
        component: () => import(/* webpackChunkName: "console" */ '@/components/console/ChangePassword.vue'),
      },
      {
        path: 'free-time',
        component: () => import(/* webpackChunkName: "console-interviewer" */ '@/components/console/interviewer/ChangeFreeTime.vue'),
      },
    ],
  },
  {
    path: '/interview/:id(\\d+)', // Matched only if :id is all numbers
    component: () => import(/* webpackChunkName: "interview" */ '../views/Interview.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;

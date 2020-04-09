import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/console',
    name: 'Console',
    component: () => import(/* webpackChunkName: "console" */ '../views/Console.vue'),
  },
  {
    path: '/interview/:id(\\d+)', // Matched only if :id is all numbers
    name: 'Interview',
    component: () => import(/* webpackChunkName: "interview" */ '../views/Interview.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;

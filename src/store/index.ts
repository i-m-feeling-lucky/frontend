import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { dummyLogin } from '@/utils/dummyUser';
import roleMap from '@/utils/roleMap';

Vue.use(Vuex);

const API_URL = process.env.VUE_APP_API_URL;

const userString = localStorage.getItem('user');
export default new Vuex.Store({
  state: {
    user: (userString !== null)
      ? JSON.parse(userString) : {
        email: null,
        name: null,
        role: null,
        token: null,
      },
    info: '',
    success: '',
    error: '',
  },
  getters: {
    logged(state) {
      return state.user.token !== null;
    },
    getUser(state) {
      return state.user;
    },
    getUserRoleString(state) {
      return roleMap[state.user.role];
    },
    getInfo(state) {
      return state.info;
    },
    getSuccess(state) {
      return state.success;
    },
    getError(state) {
      return state.error;
    },
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setInfo(state, payload) {
      state.info = payload;
    },
    setSuccess(state, payload) {
      state.success = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },

  },
  actions: {
    login({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/login`,
          {
            email: payload.email,
            password: payload.password,
          })
          .then((response) => {
            const user = {
              email: payload.email,
              name: response.data.name,
              role: response.data.role,
              token: response.data.token,
            };
            commit('setUser', user);
            localStorage.setItem('user', JSON.stringify(user));
            resolve();
          }).catch((error) => {
            reject(error);
          });
      });
    },
    logout({ commit, getters }) {
      return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/logout`,
          {
            email: getters.getUser.email,
            token: getters.getUser.token,
          })
          .then(() => {
            commit('setUser', {
              email: null,
              name: null,
              role: null,
              token: null,
            });
            localStorage.removeItem('user');
            resolve();
          }).catch((error) => {
            reject(error);
          });
      });
    },
  },
});

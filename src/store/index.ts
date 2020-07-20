import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import roleMap from '@/utils/roleMap';

Vue.use(Vuex);

const API_URL = process.env.VUE_APP_API_URL;

const userString = localStorage.getItem('user');
export default new Vuex.Store({
  state: {
    // If `user` in localStorage and not expired, restore it
    user: (userString !== null && JSON.parse(userString).expiresAt > Math.floor(Date.now() / 1000))
      ? JSON.parse(userString) : {
        id: null,
        email: null,
        role: null,
        token: null,
        expiresAt: null,
      },
    fullScreen: false,
    freeTimeArray: [],
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
    getFullScreen(state) {
      return state.fullScreen;
    },
    getFreeTimeArray(state) {
      return state.freeTimeArray;
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
    setFullScreen(state, payload) {
      state.fullScreen = payload;
    },
    setFreeTimeArray(state, payload) {
      state.freeTimeArray = payload;
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
              id: response.data.id,
              email: payload.email,
              role: response.data.role,
              token: response.data.token,
              // expiresAt: Math.floor(Date.now() / 1000) + response.data.expires,
              expiresAt: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // backend/issues/1
            };
            commit('setUser', user);
            localStorage.setItem('user', JSON.stringify(user));
            resolve();
          }).catch((error) => {
            if (error.response && error.response.data.message) {
              reject(error.response.data);
            } else {
              reject(error);
            }
          });
      });
    },
    logout({ commit, getters }) {
      return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/logout`, {}, {
          headers: { 'X-Token': getters.getUser.token },
        })
          .then(() => {
            commit('setUser', {
              id: null,
              email: null,
              role: null,
              token: null,
              expiresAt: null,
            });
            localStorage.removeItem('user');
            resolve();
          }).catch((error) => {
            if (error.response && error.response.data.message) {
              reject(error.response.data);
            } else {
              reject(error);
            }
          });
      });
    },
    changePassword({ getters }, payload) {
      return new Promise((resolve, reject) => {
        axios.put(`${API_URL}/user/${getters.getUser.id}/password`,
          {
            // eslint-disable-next-line
            old_password: payload.oldPassword,
            // eslint-disable-next-line
            new_password: payload.newPassword,
          },
          {
            headers: { 'X-Token': getters.getUser.token },
          })
          .then((response) => response.status)
          .catch((error) => {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              reject(new Error(`${error.response.status.toString()} ${error.response.statusText}`));
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser
              // and an instance of http.ClientRequest in node.js
              reject(new Error('服务器无响应'));
            } else {
              // Something happened in setting up the request that triggered an Error
              reject(new Error('生成请求时发生异常'));
            }
          });
      });
    },
    getFreeTime({ commit, getters }) {
      return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/user/${getters.getUser.id}/free_time`,
          {
            headers: { 'X-Token': getters.getUser.token },
          })
          .then((response) => {
            commit('setFreeTimeArray', JSON.parse(response.data.free_time));
            resolve();
          }).catch((error) => {
            if (error.response) {
              // TODO: 因为后端还没实现，所以在这里临时使用一些自己编的数据
              commit('setFreeTimeArray', [['2020-07-01T09:00:00', '2020-07-01T11:30:00'],
                ['2020-07-01T14:00:00', '2020-07-01T17:30:00'],
                ['2020-07-02T09:00:00', '2020-07-02T13:30:00'],
                ['2020-07-03T10:00:00', '2020-07-03T11:30:00'],
                ['2020-07-03T12:30:00', '2020-07-03T15:30:00'],
                ['2020-07-04T09:00:00', '2020-07-04T11:30:00'],
                ['2020-07-04T14:00:00', '2020-07-04T17:30:00'],
                ['2020-07-05T09:00:00', '2020-07-05T13:30:00'],
                ['2020-07-06T10:00:00', '2020-07-06T11:30:00'],
                ['2020-07-07T12:30:00', '2020-07-07T15:30:00'],
              ]);
              reject(new Error(`${error.response.status.toString()} ${error.response.statusText}`));
            } else if (error.request) {
              reject(new Error('服务器无响应'));
            } else {
              reject(new Error('生成请求时发生异常'));
            }
          });
      });
    },
    changeFreeTime({ getters }, payload) {
      return new Promise((resolve, reject) => {
        axios.put(`${API_URL}/user/${getters.getUser.id}/free_time`,
          {
            // eslint-disable-next-line
            free_time: payload,
          },
          {
            headers: { 'X-Token': getters.getUser.token },
          })
          .then((response) => response.status)
          .catch((error) => {
            if (error.response) {
              reject(new Error(`${error.response.status.toString()} ${error.response.statusText}`));
            } else if (error.request) {
              reject(new Error('服务器无响应'));
            } else {
              reject(new Error('生成请求时发生异常'));
            }
          });
      });
    },
  },
});

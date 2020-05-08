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
        email: null,
        role: null,
        token: null,
        expiresAt: null,
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
              role: response.data.role,
              token: response.data.token,
              expiresAt: Math.floor(Date.now() / 1000) + response.data.expires,
            };
            commit('setUser', user);
            localStorage.setItem('user', JSON.stringify(user));
            resolve();
          }).catch((error) => {
            if (error.response) {
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
              email: null,
              role: null,
              token: null,
              expiresAt: null,
            });
            localStorage.removeItem('user');
            resolve();
          }).catch((error) => {
            if (error.response) {
              reject(error.response.data);
            } else {
              reject(error);
            }
          });
      });
    },
  },
});

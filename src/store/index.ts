import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import dummyLogin from '@/utils/dummyLogin';


Vue.use(Vuex);

const API_URL = 'http://localhost:8080/api';

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
    error: '',
  },
  getters: {
    logged(state) {
      return state.user.token !== null;
    },
    getUser(state) {
      return state.user;
    },
    getError(state) {
      return state.error;
    },
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    clearError(state) {
      state.error = '';
    },
    setError(state, payload) {
      state.error = payload;
    },
  },
  actions: {
    login({ commit }, payload) {
      return new Promise((resolve, reject) => {
        // axios.post(`${API_URL}/login`,
        //   {
        //     email: payload.email,
        //     password: payload.password
        //   }
        // )
        dummyLogin(payload.email, payload.password)
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
        // axios.post(`${API_URL}/logout`,
        //   {
        //     // Also send the email to speedup query in db
        //     email: getters('getUser').email,
        //     token: getters('getUser').token,
        //   })
        Promise.resolve() // TODO replace with above axios
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

import { createStore } from 'vuex'
import { localState } from '../utils/index'

const store = createStore({
  state: {
    user: localState.state.user || {}
  },
  mutations: {
    login(state, newUserData) {
      state.user = newUserData
      localState.setState(data => data.user = newUserData)
    },
    logout(state) {
      state.user = {};
      localState.remove('user')
    }
  },
});

export default store
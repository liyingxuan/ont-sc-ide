import * as types from "../mutation-type"

export default {
    state : {
        Register : {
          authenticated: false
        }
    },

    mutations : {
      [types.SET_REGISTER_INFO](state) {
          state.Register.authenticated = true
      },
      [types.EMPTY_REGISTER_INFO](state) {
        state.Register.authenticated = false
      },

    }

}

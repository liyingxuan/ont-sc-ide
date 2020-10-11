import axios from 'axios'
import * as types from "../mutation-type"
import {OP_TYPE} from "../../helpers/consts";
import URL_API from "../../../config/prod.env"
let Ont = require('ontology-ts-sdk');

export default {
  state: {
    UserInfo: {
      authenticated: false,
      blockHeight: ''
    },
    OntIdInfo: {
      info: '',
    },
    OntIdProjectInfo: {
      info: '',
      authenticated: false,
    },
    ProjectUserInfo: {
      name: ''
    },
    AddOntIdInfoFalse:{
      status:false
    }
  },
  mutations: {
    [types.SET_ONTID_INFO](state, payload) {
      state.OntIdInfo.info = payload.info
      state.UserInfo.authenticated = true
    },
    [types.EMPTY_ONTID_INFO](state, payload) {
      state.OntIdInfo.info = payload.info
    },
    [types.SET_ONTID_PROJECT_INFO](state, payload) {
      state.OntIdProjectInfo.info = payload.info
      state.OntIdProjectInfo.authenticated = true
      state.UserInfo.authenticated = true
    },
    [types.SET_PROJECT_USER_INFO](state, payload) {
      state.ProjectUserInfo.name = payload.info.name
    },
    [types.LOGOUT](state, payload) {
      state.UserInfo.authenticated = false
    },
    [types.ADD_ONTID_INFO_FALSE](state, payload) {
      state.AddOntIdInfoFalse.status = payload.info
    },
  },
  actions: {
    setOntIdInfo({dispatch, commit}, $ontIdInfo) {
      commit({
        type: types.SET_ONTID_INFO,
        info: $ontIdInfo
      })
    },
    emptyOntIdInfo({dispatch, commit}) {
      commit({
        type: types.EMPTY_ONTID_INFO,
        info: ''
      })
    },
    setOntIdProjectInfo({dispatch, commit}, $ontIdProjectInfo) {
      commit({
        type: types.SET_ONTID_PROJECT_INFO,
        info: $ontIdProjectInfo
      })
    },
    registerProjectLibrary({dispatch, commit}, $ontIdInfo) {
      let url = process.env.PROJECT_LIBRARY_URL + "/register"
      let userName = $ontIdInfo.ontid
      let password = Ont.core.getHash($ontIdInfo.ontid + $ontIdInfo.privateKey.substring(0, 32))
      let param = {
        name: userName,
        password: password
      }
      return axios.post(url, param).then(res => {
        //console.log(res.data)

      }).catch(err => {
        console.log(err)
      })
    },
    getOntIdToken({dispatch, commit}, $ontIdInfo) {
      let url = process.env.PROJECT_LIBRARY_URL + "/login"
      let userName = $ontIdInfo.ontid
      let password = Ont.utils.hash160($ontIdInfo.ontid + $ontIdInfo.privateKey.substring(0, 32))
      $ontIdInfo.privateKey = '';
      let param = {
        name: userName,
        password: password
      }
      return axios.post(url, param).then(res => {
        //console.log(res.data)
        if (res.data.info === "success") {
          commit({
            type: types.SET_ONTID_PROJECT_INFO,
            info: res.data.data
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    loginProjectLibrary({dispatch, commit}) {
      let url = process.env.PROJECT_LIBRARY_URL + "/user/info"
      let param = {
        network: 'test'
      }
      return axios.post(url,param).then(function (response) {
        //console.log(response);
        let userInfo  = response.data.data
        commit({
          type: types.SET_PROJECT_USER_INFO,
          info: userInfo
        })

      }).catch(err => {
        console.log(err)
      })
    },
    logout({dispatch, commit}) {
      commit({
        type: types.LOGOUT
      })
    },

    addOntIdforUser({dispatch, commit}, $ontIdInfo) {
      let url = process.env.PROJECT_LIBRARY_URL + "/user/ontid/add"
      let userName = $ontIdInfo.ontid
      let password = Ont.utils.hash160($ontIdInfo.ontid + $ontIdInfo.privateKey.substring(0, 32))
      let param = {
        name: userName,
        password: password
      }
      return axios.post(url, param).then(res => {
        console.log(res.data)

        if(res.data.code === -1){
          commit({
            type : types.ADD_ONTID_INFO_FALSE,
            info : true
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
/**
 * Set required for JWT user authentication http Authorization head info.
 */


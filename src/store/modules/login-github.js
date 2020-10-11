import axios from "axios/index";
import URL_API from "../../../config/prod.env"
import * as types from "../mutation-type";
import Cookies from 'vue-cookies'
import PARAM from "../../../config/prod.env"
let Ont = require('ontology-ts-sdk');

export default {
  state: {
    UserGithubInfo: {
      info: '',
    },
    AddGithubInfoFalse:{
      status:false
    }
  },
  mutations: {
    [types.SET_USER_GITHUB_INFO](state, payload) {
      state.UserGithubInfo.info = payload.info
    },
    [types.ADD_GITHUB_INFO_FALSE](state, payload) {
      state.AddGithubInfoFalse.status = payload.info
    },
  },
  actions: {
    getUserGithubInfo({dispatch, commit}, $code) {

      let url = process.env.GITHUB_GET_ACCESS_TOKEN+"client_id="+process.env.GITHUB_CLIENT_ID+"&client_secret="+process.env.GITHUB_CLIENT_SECRET+"&"+$code
      console.log($code)


      return axios.get(url).then(res => {

        let Result = res.data
        let accessToken

        if(Result.substring(0,12) === "access_token"){
          accessToken = Result.substring(0,53)

          let getUserInfoUrl = process.env.GITHUB_GET_USER_INFO+accessToken
          return axios.get(getUserInfoUrl).then($res => {
            //console.log($res.data)
            commit({
              type: types.SET_USER_GITHUB_INFO,
              info: $res.data
            })

          }).catch(err => {
            console.log(err)
          })
        }else{
          console.log(Result)
        }

      }).catch(err => {
       console.log(err)
      })
    },
    loginByGithubId({dispatch, commit}, $githubInfo) {
      let url = process.env.PROJECT_LIBRARY_URL + "/github/login"
      let githubId = $githubInfo.id
      let password = Ont.utils.hash160(githubId)
      let param = {
        github_id: githubId.toString(),
        github_password: password,
        github_name : $githubInfo.name
      }
      console.log($githubInfo)
      return axios.post(url, param).then(res => {
        if (res.data.info === "success") {
          let userToken = res.data.data
          commit({
            type: types.SET_ONTID_PROJECT_INFO,
            info: res.data.data
          })
          Cookies.set("token",userToken.token,userToken.expires_in)
          Cookies.set("auth_id",userToken.auth_id,userToken.expires_in)
          Cookies.set("version", PARAM.VERSION, 60 * 60)
        }
      }).catch(err => {
        console.log(err)
      })
    },

    addGithubIdForUser({dispatch, commit}, $githubInfo){
      let url = process.env.PROJECT_LIBRARY_URL + "/user/github/add"
      let githubId = $githubInfo.id
      let password = Ont.utils.hash160(githubId)
      let param = {
        github_id: githubId.toString(),
        github_password: password,
        github_name : $githubInfo.name
      }
      return axios.post(url, param).then(res => {

        if(res.data.code === -1){
          commit({
            type : types.ADD_GITHUB_INFO_FALSE,
            info : true
          })
        }

      }).catch(err => {
        console.log(err)
      })

    },


  }
}

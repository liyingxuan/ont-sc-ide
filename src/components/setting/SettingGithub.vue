<template>
  <div class="container-fluid">
    <div class="Subhead">
      <div class="Subhead-heading">{{ $t('setting.github')}}</div>
    </div>
    <div class="sc-setting-info">
      <div class="sc-setting-info-title">{{ $t('settingGithub.title')}}</div>
      <div v-show="showGithub" class="sc-setting-info-content">
        <div class="sc-setting-github-border row">
          <img class="sc-setting-github-github-img" src="../../assets/login/github.png" alt="">
          <div class="sc-setting-github-github-text">{{githubName}}</div>
        </div>

      </div>
      <div v-show="!showGithub" class="sc-setting-info-content">{{ $t('settingGithub.noAccount')}}</div>
    </div>
    <div class="sc-setting-info">
      <button v-show="showGithub & showDeletcGithub" class="btn btn-outline-success sc-setting-delete" @click="deleteGithub()">{{ $t('settingGithub.removeBinding')}}</button>
      <button v-show="!showGithub" class="btn btn-outline-success sc-setting-submit" @click="addGithubId()" >{{ $t('settingGithub.binding')}}</button>
    </div>
  </div>
</template>

<script>

  import axios from "axios/index";
  import {mapState} from 'vuex'
  import * as types from './../../store/mutation-type'
  import LangStorage from './../../helpers/lang'
  import zh from './../../common/lang/zh'
  import en from './../../common/lang/en'

  export default {
    name: "setting-github",
    data(){
      return{
        ontId: '',
        githubId: '',
        githubName: '',
        showGithub: true,
        showDeletcGithub: false,
      }
    },
    created(){
    },
    mounted(){
      if(this.addGithubInfoFalse.status){
        this.showGithub = false
        this.showAddGithubFalseModal()
        this.closeModal()
      }else{
        this.getUserGithubInfo()
      }

    },
    computed: {
      ...mapState({
        addGithubInfoFalse: state => state.LoginGithub.AddGithubInfoFalse,
        userGithubInfo: state => state.LoginGithub.UserGithubInfo,
      }),
    },
    methods:{
      getUserGithubInfo(){
        let url = process.env.PROJECT_LIBRARY_URL + "/user/info"
        axios.post(url).then(res => {

          //console.log(res.data)
          let userInfo = res.data
          this.ontId = userInfo.data.name
          this.githubId = userInfo.data.github_id
          this.githubName = userInfo.data.github_name

          if(!this.githubId){
            this.showGithub = false
          }
          if(this.ontId !== ""){
            this.showDeletcGithub = true
          }
        }).catch(err => {
          console.log(err)
        })
      },
      deleteGithub(){
        let url = process.env.PROJECT_LIBRARY_URL + "/user/github/delete"

        axios.post(url).then(res => {
          console.log(res)
          location.reload()
        }).catch(err => {
          console.log(err)
        })

      },
      addGithubId(){
        let gitUrl = process.env.GITHUB_GET_CODE+ "&state="+(new Date()).valueOf()
        window.location.href = gitUrl;
      },
      showAddGithubFalseModal(){
        let title = (LangStorage.getLang('zh') === "zh") ? zh.settingGithub.bindFalse : en.settingGithub.bindFalse
        let content = (LangStorage.getLang('zh') === "zh") ? zh.settingGithub.accountExist : en.settingGithub.accountExist
        let payload = {
          title:title,
          content:content,
          isShowCloseButton:true
        }
        this.$store.dispatch('showLoadingModals',payload)
      },
      closeModal(){
        this.$store.commit({
          type : types.ADD_GITHUB_INFO_FALSE,
          info : false
        })
      }
    }
  }
</script>

<style scoped>

  .Subhead {
    display: flex;
    padding-bottom: 8px;
    margin-bottom: 16px;
    border-bottom: 1px #e1e4e8 solid;
    flex-flow: row wrap;
  }
  .Subhead-heading {
    font-size: 24px;
    font-weight: normal;
    flex: 1 1 auto;
  }

  .sc-setting-info{
    margin-top: 28px;
  }
  .sc-setting-info-title{
    font-weight: bold;
    margin-bottom: 6px;
  }
  .sc-setting-info-content{
    margin-bottom: 6px;
  }
  .sc-setting-submit {
    min-width: 180px;
    height: 40px;
    color: white;
    border-color: #32A4BE;
    background: #32A4BE;
    margin-bottom: 28px;
    border-radius: 3px;
    margin-left: 2px;
  }
  .sc-setting-submit:hover,
  .sc-setting-submit:active {
    background-color: white;
    color: #32A4BE;
  }
  .sc-setting-submit:focus{
    box-shadow:none !important;
    outline: none !important;
    background-color: #32A4BE !important;
    border-color: #32A4BE !important;
  }
  .sc-setting-delete {
    min-width: 140px;
    height: 40px;
    color: #6c757d;
    border-color: #6c757d;
    background: white;
    margin-bottom: 28px;
    border-radius: 3px;
    margin-left: 2px;
  }
  .sc-setting-delete:hover,
  .sc-setting-delete:active {
    background-color: white;
    color: #212529;
    border-color: #212529;
  }
  .sc-setting-delete:focus{
    box-shadow:none !important;
    outline: none !important;
    background-color: #6c757d !important;
    border-color: #6c757d !important;
  }
  .sc-setting-github-border{
    border: 1px solid #e1e4e8;
    background:#f3f5f8 ;
    border-radius: 3px;
    margin: 22px 0 0 2px;
    width:fit-content;
    width:-moz-fit-content;
  }
  .sc-setting-github-github-img{
    height: 30px;
    margin: 16px 16px 16px 16px;
  }
  .sc-setting-github-github-text{
    margin-top: 18px;
    margin-right: 16px;
  }

</style>

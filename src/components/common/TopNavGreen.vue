<template>
  <div class="fixed-top">
    <nav class="navbar navbar-expand-lg navbar-expand-md navbar-expand-sm navbar-expand-xs green-navbar-elevation">
      <div class="navbar-brand " ><img class="green-navbar-logo" src="../../assets/topNavGreen/logo_smartx.png" alt=""></div>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav mr-auto ">
          <li class="green-nav-item navbar-collapse">
            <a class="nav-link green-navbar-txt green-navbar-pointer" style="margin-bottom: 8px" :href="tutorialUrl" target="_self">{{ $t('navbar.tutorial')}}</a>
          </li>
          <li class="green-nav-item navbar-collapse">
            <label class="nav-link green-navbar-txt green-navbar-pointer" @click="toHelp">{{ $t('navbar.help')}}</label>
          </li>
          <li class="green-nav-item navbar-collapse">
            <label class="nav-link green-navbar-txt green-navbar-pointer" @click="toAbout">{{ $t('navbar.about')}}</label>
          </li>

          <li class="green-nav-item navbar-collapse dropdown" >
            <label class="nav-link green-navbar-txt green-navbar-pointer dropdown-toggle" id="nav-menu-support" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{ $t('navbar.support')}}</label>
            <div class="dropdown-menu green-nav-dropdown-menu" aria-labelledby="nav-menu-support">
              <a class="dropdown-item green-navbar-pointer green-navbar-dropdown-item green-navbar-pointer-list" :href="discordUrl">Discord</a>
              <a class="dropdown-item green-navbar-pointer green-navbar-dropdown-item green-navbar-pointer-list" href="mailto:feedback@ont.io">{{ $t('navbar.feedback') }}</a>
            </div>
          </li>

          <li class="green-nav-item navbar-collapse dropdown" v-if="userInfo.authenticated">
            <label class="nav-link green-navbar-txt green-navbar-pointer dropdown-toggle" id="nav-menu-Project" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{ $t('navbar.project')}}</label>
            <div class="dropdown-menu green-nav-dropdown-menu" aria-labelledby="nav-menu-Project">
              <a class="dropdown-item green-navbar-pointer green-navbar-dropdown-item green-navbar-pointer-list" @click="returnToPrjectList">{{ $t('navbar.returnToPrjectList')}}</a>
              <a class="dropdown-item green-navbar-pointer green-navbar-dropdown-item green-navbar-pointer-list" @click="toSetting">{{ $t('navbar.toSetting')}}</a>
              <a class="dropdown-item green-navbar-pointer green-navbar-dropdown-item green-navbar-pointer-list" target="_blank" :href="referencesUrl">{{ $t('navbar.references')}}</a>
              <a class="dropdown-item green-navbar-pointer green-navbar-dropdown-item green-navbar-pointer-list" @click="exitIDE">{{ $t('navbar.exit')}}</a>
            </div>
          </li>

          <li class="green-nav-item navbar-collapse dropdown" >
            <label class="nav-link green-navbar-txt green-navbar-pointer dropdown-toggle" id="nav-menu-lang" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{ $t('navbar.lang')}}</label>
            <div class="dropdown-menu green-nav-dropdown-menu" aria-labelledby="nav-menu-lang">
              <a class="dropdown-item green-navbar-pointer green-navbar-dropdown-item green-navbar-pointer-list" @click="changeLanguageToEn()">EN</a>
              <a class="dropdown-item green-navbar-pointer green-navbar-dropdown-item green-navbar-pointer-list" @click="changeLanguageToZh()">CN</a>
            </div>
          </li>
        </ul>
        <ul class="navbar-nav">

<!--          <li class="green-nav-item navbar-collapse" style="margin-right: 160px" v-if="!userInfo.authenticated">
            <label class="nav-link green-navbar-txt green-navbar-pointer" style="margin-right: 10px;font-weight: bold" @click="login()">{{ $t('navbar.login') }}</label>
            <p style="font-size: 18px;margin-top: 6px;color: #686868;">or</p>
            <label class="nav-link green-navbar-signup green-navbar-pointer" style="margin-left: 10px;font-weight: bold" @click="register()">{{ $t('navbar.register') }}</label>
          </li>-->

        </ul>

      </div>
    </nav>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import LangStorage from './../../helpers/lang'

  export default {
    props: ['showLogoClick'],
    name: 'TopNav',
    data() {
      return {
        noName: 'No Name',
        referencesUrl: 'https://github.com/ontio/documentation/tree/master/smart-contract-tutorial/examples',
        tutorialUrl:'https://ontio.github.io/documentation/SmartX_Tutorial_en.html',
        discordUrl:'https://discord.gg/4TQujHj'
      }
    },
    computed: {
      ...mapState({
        userInfo: state => state.LoginPage.UserInfo,
      })
    },
    methods: {
      goBackToHome(){
        if(this.showLogoClick){
          this.$router.push({ name: 'Home'})
        }
      },
      changeLanguageToZh(){
        this.$i18n.locale = 'zh'
        this.$validator.localize('zh')
        this.$emit('isUseChinese',true)
        LangStorage.setLang(this.$i18n.locale)
      },
      changeLanguageToEn(){
        this.$i18n.locale = 'en'
        this.$validator.localize('en')
        this.$emit('isUseChinese',false)
        LangStorage.setLang(this.$i18n.locale)
      },
      exitIDE() {
        if (this.$cookies.isKey("token")) {
          this.$cookies.remove("token")
          this.$cookies.remove("auth_id")
          let _self = this
          this.$store.dispatch('logout').then(function (response) {
            _self.clearIDEInfo(_self)
            _self.$router.push({name: 'Login'})
          })
        }
      },
      returnToPrjectList(){
        this.clearIDEInfo(this)
        this.$router.push({ name: 'ProjectList'})
      },
      toSetting(){
        this.$router.push({ name: 'SettingOntId'})
      },
      toHelp(){
        this.$router.push({ name: 'Help'})
      },
      toAbout(){
        this.$router.push({ name: 'About'})
      },
      clearIDEInfo(_self){
        _self.$store.dispatch('clearCompileInfo')
        _self.$store.dispatch('clearDeployContractInfo')
        _self.$store.dispatch('clearContractHash')
        sessionStorage.clear();
      },
      register() {
        this.$router.push({ name:'Register'})
      },
      login() {
        if(this.$cookies.isKey("token")){
          this.$store.dispatch('loginProjectLibrary')
          this.$router.push({ name: 'ProjectList'})
        }else{
          this.$router.push({ name:'Login'})
        }
      }
    }
  }
</script>

<style>
  .green-sub-title {
    margin-top: 20px;
    font-size: 1rem;
    color: #ffffff;
    font-style: normal;
  }
  .green-navbar-trial {
    position: absolute;
    left: 50%;
    color:#fcfcfc;
    font-size:14px;
    margin-left: -127px;
    margin-top: 5px;
  }
  .green-navbar-logo {
    margin-right: 30px;
    padding: 0px 6px 0px 6px;
  }
  .green-form-control {
    font-size: 1em;
  }
  .green-navbar-select {
    padding: 0 5px;
  }
  .green-navbar-elevation {
    background-color:#041317;
    height: 75px;
    width: 100%;
  }
  .green-nav-item {
    margin-top: 12px;
    margin-right: 30px;
  }
  select.green-form-control:not([size]):not([multiple]) {
    height:28px;
  }
  .navbar-select {
    padding:0 50px 0 10px;
    line-height:1;
    border-radius:0px;
  }
  .green-nav-center{
    text-align: center;
  }
  .green-navbar-txt {
    font-size: 18px;
    color: #ffffff;
  }
  .green-navbar-txt:hover,
  .green-navbar-txt:active {
    color: #CCCCCC;
  }
  .green-navbar-signup{
    font-size: 18px;
    color: #32A4BE;
  }
  .green-navbar-signup:hover,
  .green-navbar-signup:active {
    color: #117a8b;
  }

  .green-navbar-pointer:hover {
    cursor: pointer;
  }
  .green-navbar-pointer-list{
    padding-top: 19px !important;
    height: 60px;
    border-bottom: 1px solid #f3f5f6 !important;
  }
  .green-navbar-back-button{
    width:120px;
    height: 20px;
    background-color: #FCFCFC; /* Can be set to transparent */
    position: absolute;
    left: 50%;
    right: 50%;
    margin-left:-60px;
    top: 55px;
    z-index:600;
  }
  .green-navbar-circle-center {
    width: 68px;
    height: 34px;
    background-color: #FCFCFC; /* Can be set to transparent */
    border-radius:34px 34px 0 0 ;
    position: absolute;
    left: 50%;
    right: 50%;
    margin-left:-34px;
    top: 40px;
    z-index:800;
  }
  .green-navbar-circle-left {
    width: 70px;
    height: 70px;
    background-color: #32A4BE; /* Can be set to transparent */
    -webkit-border-radius: 100px;
    position: absolute;
    left: 50%;
    right: 50%;
    margin-left:-94.5px;
    top: 5px;
    z-index:800;
  }
  .green-navbar-circle-right {
    width: 70px;
    height: 70px;
    background-color: #32A4BE; /* Can be set to transparent */
    -webkit-border-radius: 100px;
    position: absolute;
    left: 50%;
    right: 50%;
    margin-left: 24.5px;
    top: 5px;
    z-index:800;
  }
  .green-navbar-title-button{
    z-index: 999;
    height: 10px;
    margin-top: 28px;
  }
  .green-nav-dropdown-menu{
    padding:0 ;
    margin-top: -5px;
    margin-left: -90px;
  }
  .green-navbar-dropdown-item{
    font-size: 14px;
  }
  .green-navbar-txt-feedback{
    margin-top: 8px;
    font-size: 18px;
    color: #ffffff;
  }
  .green-navbar-txt-feedback:hover,
  .green-navbar-txt-feedback:active {
    color: #CCCCCC;
    text-decoration:none;
  }
  .nav-item > input::-webkit-input-placeholder { color:#cacaca; }
  .nav-item > input::-moz-placeholder { color:#cacaca; } /* firefox 19+ */
  .nav-item > input:-ms-input-placeholder { color:#cacaca; } /* ie */
  .nav-item > input:-moz-placeholder { color:#cacaca; }
</style>

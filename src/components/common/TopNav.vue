<template>
  <nav class="navbar navbar-expand-lg navbar-expand-md navbar-expand-sm navbar-expand-xs fixed-top navbar-elevation">

    <router-link class="navbar-brand" :to="{path: '/'}"><img class="navbar-logo" src="../../assets/topNav/logo.png"></router-link>

    <div class="collapse navbar-collapse">
      <i class="sub-title navbar-gray">{{$t('navbar.version')}}</i>
      <ul class="navbar-nav mr-auto"></ul>
      <ul class="navbar-nav">

        <li class="nav-item navbar-collapse">
          <label class="nav-link navbar-txt navbar-pointer" ><a class="navbar-txt-feedback" href="mailto:feedback@ont.io">{{ $t('navbar.feedback') }}</a></label>
        </li>

        <li class="nav-item navbar-collapse">
          <label class="nav-link navbar-txt navbar-pointer" @click="register()">{{ $t('navbar.register') }}</label>
        </li>

        <!--<li class="nav-item navbar-collapse">-->
          <!--<label class="nav-link navbar-txt navbar-pointer" >{{ $t('navbar.testNet') }}</label>-->
        <!--</li>-->

        <li class="nav-item navbar-collapse">
          <label class="nav-link navbar-txt navbar-pointer" @click="chooseLanguage()">{{ $t('language.name') }}</label>
        </li>

        <li class="green-nav-item navbar-collapse dropdown" >
          <label class="nav-link navbar-txt navbar-pointer dropdown-toggle" id="nav-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-bars" ></i></label>
          <div class="dropdown-menu nav-dropdown-menu" aria-labelledby="nav-menu">
            <a class="dropdown-item navbar-pointer navbar-dropdown-item" @click="toHelp">{{ $t('navbar.help')}}</a>
            <a class="dropdown-item navbar-pointer navbar-dropdown-item" :href="tutorialUrl">{{ $t('navbar.tutorial')}}</a>
            <a class="dropdown-item navbar-pointer navbar-dropdown-item" @click="toAbout">{{ $t('navbar.about')}}</a>
          </div>
        </li>
      </ul>
    </div>
    <label class="nav-link navbar-gray navbar-introduce" >{{ $t('navbar.introduce') }}</label>
  </nav>
</template>

<script>
  import {mapState} from 'vuex'
  import LangStorage from './../../helpers/lang'

  export default {
    name: 'TopNav',
    data() {
      return {
        noName: 'No Name',
        lang: this.$i18n.locale === 'zh' ?  '中文' : 'English',
        tutorialUrl:'https://ontio.github.io/documentation/SmartX_Tutorial_en.html'
      }
    },
    created() {
    },
    watch:{
    },
    computed: {
      ...mapState({
        userInfo: state => state.LoginPage.UserInfo,
      })
    },
    methods: {
      toAbout(){
        this.$router.push({ name: 'About'})
      },
      chooseLanguage() {
        let locale = this.$i18n.locale
        locale === 'zh' ? this.$i18n.locale = 'en' : this.$i18n.locale = 'zh'
        locale === 'zh' ? this.$validator.localize('en') : this.$validator.localize('zh')
        LangStorage.setLang(this.$i18n.locale)
      },
      register() {
        this.$router.push({ name:'Register'})
      },
      toHelp(){
        this.$router.push({ name: 'Help'})
      },
    }
  }
</script>

<style>
  .sub-title {
    margin-top: 20px;
    font-size: 1rem;
    color: #36a3bc;
    font-style: normal;
  }
  .navbar-logo {
    height: 35px;
    margin-right: 5px;
    padding: 0 6px;
  }
  .form-control {
    font-size: 1em;
  }
  .navbar-select {
    padding: 0 5px;
  }
  .navbar-elevation {
    height: 75px;
    border-bottom: 0px;
    background-color: #FCFCFC;
  }
  .nav-item {
    margin-right: 50px;
    font-weight: 300;
  }
  select.form-control:not([size]):not([multiple]) {
    height:28px;
  }
  .navbar-select {
    padding:0 50px 0 10px;
    line-height:1;
    border-radius:0px;
  }
  .navbar-txt {
    margin-top: 8px;
    font-size: 18px;
    color: #36a3bc;
  }
  .navbar-txt:hover,
  .navbar-txt:active {
    color: green;
  }
  .navbar-pointer:hover {
    cursor: pointer;
  }
  .navbar-gray {
    color: #a3a3a3;
    font-size: 14px;
  }
  .nav-dropdown-menu{
    margin-top: -5px;
    margin-left: -90px;
  }
  .navbar-dropdown-item{
    font-size: 14px;
  }
  .navbar-introduce{
    position: absolute;
    left: 50%;
    margin-left: -127px;
    font-size:14px;
    margin-top: 5px;
  }
  .navbar-txt-feedback{
    margin-top: 8px;
    font-size: 18px;
    color: #36a3bc;
  }
  .navbar-txt-feedback:hover,
  .navbar-txt-feedback:active {
    color: green;
    text-decoration:none;
  }
  .nav-item > input::-webkit-input-placeholder { color:#cacaca; }
  .nav-item > input::-moz-placeholder { color:#cacaca; } /* firefox 19+ */
  .nav-item > input:-ms-input-placeholder { color:#cacaca; } /* ie */
  .nav-item > input:-moz-placeholder { color:#cacaca; }
</style>

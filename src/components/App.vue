<template >
  <div id="app" class="app-page ">
    <!--<top-nav></top-nav>-->
    <div v-show="isShowTopNav">
      <top-nav  v-on:isUseChinese="isUseChineseLanguage"></top-nav>
    </div>
    <div v-show="!isShowTopNav">
      <top-nav-green :showLogoClick="isShowHomeLogoClick"  v-on:isUseChinese="isUseChineseLanguage"></top-nav-green>
    </div>
    <div :class="[$router.currentRoute.name === 'Login'||$router.currentRoute.name === 'Recovery'||$router.currentRoute.name === 'Register'
    ||$router.currentRoute.name === 'RegisterSuccess'||$router.currentRoute.name === 'RegisterSuccessPrivateKey'||$router.currentRoute.name === 'LoginGithub'  ? 'container-div-home container-div-home-background' : 'container-div']">
      <div :class="[$router.currentRoute.name === 'Login'||$router.currentRoute.name === 'Recovery'||$router.currentRoute.name === 'Register'
       ||$router.currentRoute.name === 'RegisterSuccess'||$router.currentRoute.name === 'RegisterSuccessPrivateKey'  ? 'container-div-home-pic' : 'app-page']">
        <router-view v-on:isShowTopNav="isShowTopNavGreen" v-on:isShowLogoClick="isShowLogoClick" :useChineseLanguage="isUseChineseLang"/>
      </div>

    </div>

    <loading-modal></loading-modal>
  </div>
</template>

<script>
  import TopNav from './common/TopNav'
  import TopNavGreen from './common/TopNavGreen'
  import 'bootstrap/dist/css/bootstrap.min.css'
  import 'bootstrap/dist/js/bootstrap.min.js'
  import LoadingModal from './Modals/Loading'

  export default {
    name: 'App',
    data() {
      return {
        isShowTopNav: true,
        isShowHomeLogoClick: false,
        isUseChineseLang: this.$i18n.locale === 'zh' ? true : false,
      }
    },
    components: {
      TopNav,
      TopNavGreen,
      LoadingModal
    },
    created(){
    },
    methods:{
      isShowTopNavGreen($data){
        this.isShowTopNav = $data
      },
      isShowLogoClick($data){
        this.isShowHomeLogoClick = $data
      },
      isUseChineseLanguage($data){
        this.isUseChineseLang = $data
      },
    }
  }
</script>

<style>
  @import url("https://fonts.googleapis.com/css?family=Montserrat:300,400,500,700,900");

  body {
    font-family: Roboto, Verdana, "Microsoft YaHei", "微软雅黑", sans-serif;
    font-weight: 300;
    background-color: #fcfcfc;
  }

  p {
    font-family: Roboto, Verdana, "Microsoft YaHei", "微软雅黑", sans-serif;
    font-weight: 300;
  }

  .ace_breakpoint {
    background-color: red!important;
  }

  .ace_breakpoint_active {
    background-color: green!important;
  }

  /* top nav height */
  .container-div {
    /*height: 100px;*/
    padding-top: 75px;
    height: 100%;
    background: white;
  }
  .container-div-home {
    /*height: 100px;*/
    padding-top: 75px;
    min-height: 100%;
  }
  .container-div-home-pic{
    background-image:url(../assets/login/home_background.png);
    background-position: center top;
    background-repeat: repeat;
    background-size: auto;
    min-height: 100vh;
  }
  .container-div-home-background{
    background: -webkit-linear-gradient(#142B2F, #041317); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#142B2F, #041317); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#142B2F, #041317); /* Firefox 3.6 - 15 */
    background: linear-gradient(#142B2F, #041317); /* 标准的语法 */
  }
  .app-page{
    height: 100%;
  }

     .btn-submit {
    border-radius: 0;
    width: 100px;
    color: white;
    border-color: #36a3bc;
    background-color: #36a3bc;
    font-size: 10px;
    padding: 4px 9px;
  }
  .btn-submit:hover,
  .btn-submit:active {
    background-color: #2ec0e0;
    color: white;
  }

  .jv-container .jv-code {
    overflow-y: scroll !important;
}
</style>

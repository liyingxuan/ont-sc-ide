<template>
  <div class="container-fluid">
      <div class="container maintenance-container">
        <div class="row text-center maintenance-row">
          <div class="col-12 ">
            <div class="loader">Loading...</div>
          <div class="col-12 maintenance-col-tit">{{$t('githubLogin.waiting')}}</div>
          <div class="col-12 font-weight-light maintenance-col-url">
            {{$t('githubLogin.returnToHome')}}<a :href="url">{{$t('githubLogin.homePage')}}</a>
          </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "loginGithub",
    data() {
      return {
        url:'/',
      }
    },
    mounted(){

    },
    created(){
      this.showTopNavGreen()

      this.getGithubUserInfo()

    },
    computed: {
      ...mapState({
        userGithubInfo: state => state.LoginGithub.UserGithubInfo,
      })
    },
    methods: {
      showTopNavGreen(){
        this.$emit('isShowTopNav',false) //Show the white topnav or not //是否显示白色的topnav
        this.$emit('isShowLogoClick', true)//Show the logo click or not //是否使logo点击可返回
      },
      getGithubUserInfo(){
        let code = location.search.substring(1);
        let $_self = this

        if(this.$cookies.isKey("token") && this.$cookies.isKey("auth_id")){ //Get githubInfo from setting //从设置功能登陆GitHub

          this.$store.dispatch('getUserGithubInfo', code).then(res=>{
            console.log($_self.userGithubInfo.info)
            $_self.$store.dispatch('addGithubIdForUser', $_self.userGithubInfo.info).then(res=>{

              this.$router.push({ name:'SettingGithub'})
            })
          })

        }else{//正常登陆
          this.$store.dispatch('getUserGithubInfo', code).then(res=>{

            $_self.$store.dispatch('loginByGithubId', $_self.userGithubInfo.info).then(res=>{
              this.$router.push({ name:'Login'})
            })

          })
        }
      }
    }
  }
</script>

<style scoped>

  .maintenance-container {
    width:70%;
  }
  .maintenance-row {
    height: 360px;
    margin-top: 10%;
    border: white solid 1px;
    border-radius: 5px;
    padding: 30px;
    color: white;
  }
  .maintenance-logo {
    color: white;
    margin-top: 5%;
    height: 25%;
  }
  .maintenance-col-tit {
    margin-top: 5%;
    font-size: 32px;
  }
  .maintenance-col-url {
    margin-top: 3%;
    font-size: 16px;
  }

  .loader {
    color: #ffffff;
    font-size: 50px;
    text-indent: -9999em;
    overflow: hidden;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    margin: 72px auto;
    position: relative;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: load6 1.7s infinite ease, round 1.7s infinite ease;
    animation: load6 1.7s infinite ease, round 1.7s infinite ease;
  }
  @-webkit-keyframes load6 {
    0% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
    5%,
    95% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
    10%,
    59% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
    }
    20% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em, -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em, -0.749em -0.34em 0 -0.477em;
    }
    38% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em, -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em, -0.82em -0.09em 0 -0.477em;
    }
    100% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
  }
  @keyframes load6 {
    0% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
    5%,
    95% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
    10%,
    59% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
    }
    20% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em, -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em, -0.749em -0.34em 0 -0.477em;
    }
    38% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em, -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em, -0.82em -0.09em 0 -0.477em;
    }
    100% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
  }
  @-webkit-keyframes round {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes round {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }


</style>

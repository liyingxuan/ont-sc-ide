<template>
  <div class="container-fluid">

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-8">

          <div class="login-title-smartx">
            <img class="" src="../../assets/login/logo_smartX_l.png" alt="">
            <legend class="login-smartx-title-text">{{$t('home.smartXInfo_1')}}<span class="login-smartx-title-text_ide">{{$t('home.smartXInfo_green')}}</span>{{$t('home.smartXInfo_2')}}</legend>
          </div>

          <div class="login-border">
            <form @submit.prevent="submitLogin">
              <fieldset>
                <legend class="login-title">{{$t('login.login')}}</legend>

                <div class="form-group login-file">
                  <div class="input-group login-file-input">
                    <div class="custom-file login-file-input">
                      <input type="file" @change="onFileChange" class="custom-file-input" id="exampleInputFile" aria-describedby="fileHelp"
                             name="file" v-validate data-vv-rules="required">
                      <label id="input-file-label" class="custom-file-label" for="exampleInputFile" >{{FileName}}</label>
                    </div>
                  </div>
                  <small class="form-text text-muted err-message login-error-text" v-show="errors.has('file')">{{ errors.first('file') }}</small>
                </div>

                <div class="form-group login-password">
                  <div class="input-group">
                    <input :type="[isShowPassword ? 'text' : 'password']"
                           v-model="password"
                           v-validate data-vv-rules="required|min:6"
                           class="form-control login-input" name="password" :placeholder="$t('login.enterPassword')">
                  </div>
                  <small class="form-text text-muted err-message login-error-text" v-show="errors.has('password')">{{ errors.first('password') }}</small>
                </div>

              </fieldset>
              <button class="btn btn-outline-success login-btn-submit" @click.prevent="submitLogin(password)">{{ $t('login.open') }}</button>
            </form>
            <div>
<!--              <legend class="login-sign-up" @click="toSignUp">{{$t('login.signUp')}}</legend>-->

              <legend class="login-third—party" >{{$t('login.thirdParty')}}</legend>
              <img class="login-github" @click="loginFromGithub" src="../../assets/login/github.png" alt="">

<!--              <legend class="login-bottom-text" @click="toRecovery">{{$t('login.loginInfo_1')}}</legend>
              <legend class="login-bottom-text" @click="toRecovery">{{$t('login.loginInfo_2')}}</legend>-->
            </div>
          </div>
         <div class="login-powered-by-ontology-pic">
            <a :href="OntUrl"><img class="login-powered-by-ontology" src="../../assets/login/powered_by_ontology.png" alt=""></a>
          </div>


        </div>
        <div class="alert alert-dismissible alert-danger login-alert" v-show="isShowUnlockWrongAlert">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
          <strong>{{loginError}}</strong>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import GetWalletFileMsg from './../../common/ont-wallet/info'
  import FileHelper from './../../common/ont-wallet/file-generate-and-get'
  import Sleep from './../../helpers/sleep'
  import zh from './../../common/lang/zh'
  import en from './../../common/lang/en'
  import LangStorage from './../../helpers/lang'
  import PARAM from "../../../config/prod.env"

  export default {
    props: ['useChineseLanguage'],
    name: "login",
    data() {
      return {
        password: '',
        isShowPassword: false,
        FileName: '',
        WalletFile: '',
        isShowLoading: false,
        isShowUnlockWrongAlert: false,
        loginError: '',
        OntUrl:'https://ont.io/'
      }
    },
    mounted(){
      this.getInputFileText()
    },
    created(){
      this.showTopNavGreen()
      if (this.$cookies.isKey("token")) {
        this.$store.dispatch('loginProjectLibrary')
        this.$router.push({name: 'ProjectList'})
      } else {
        this.$router.push({name: 'Login'})
      }
    },

    watch: {
      'useChineseLanguage': 'getInputFileText',
    },
    computed: {
      ...mapState({
        ontIdProjectInfo: state => state.LoginPage.OntIdProjectInfo,
        projectUserInfo: state => state.LoginPage.ProjectUserInfo,
        userGithubInfo: state => state.LoginGithub.UserGithubInfo,
      })
    },
    methods: {
      showTopNavGreen(){
        this.$emit('isShowTopNav',false) //Show the white topnav or not //是否显示白色的topnav
        this.$emit('isShowLogoClick', true)//Show the logo click or not //是否使logo点击可返回
      },
      getInputFileText(){
        if(LangStorage.getLang('zh') === "zh"){
          let p=document.getElementById('input-file-label');
          p.setAttribute("class","custom-file-zh-text-label");
        }else{
          let p=document.getElementById('input-file-label');
          p.setAttribute("class","custom-file-label");
        }
        this.FileName = (LangStorage.getLang('zh') === "zh") ? zh.login.chooseFile : en.login.chooseFile
      },
      viewPassword() {
        this.isShowPassword = !this.isShowPassword
      },
      toSignUp(){
        this.$router.push({ name:'Register'})
      },
      toRecovery(){
        this.$router.push({ name:'Recovery'})
      },
      submitLogin($password) {
        this.$validator.validateAll().then($result => {
          if ($result) {

            this.showLoginLoadingModal()

            Sleep.sleep(200).then(() => {
              FileHelper.readWalletFile(this.WalletFile).then( ($walletFile) => {
                if($walletFile) {
                  let info = GetWalletFileMsg.decryptWalletFile($walletFile, $password)
                  if(info.isGetInfo) {
                    let _self = this
                    this.$store.dispatch('setOntIdInfo', info).then(function (res) {
                      _self.getOntIdProjectList(info,_self)
                    })
                  }else{
                    this.$store.dispatch('hideLoadingModals')
                    if(info.err == 53000 || info.err === 42002){
                      this.isShowUnlockWrongAlert = true
                      this.loginError = (LangStorage.getLang('zh') === "zh") ? zh.login.unlockWrong : en.login.unlockWrong
                    } else if(info.err === 'NOT_SUPPORTED_WALLET' ) {
                      this.isShowUnlockWrongAlert = true
                      this.loginError = (LangStorage.getLang('zh') === "zh") ? zh.login.NOT_SUPPORTED_WALLET : en.login.NOT_SUPPORTED_WALLET
                    } else if(info.err === 'INVALID_WALLET') {
                      this.isShowUnlockWrongAlert = true
                      this.loginError = (LangStorage.getLang('zh') === "zh") ? zh.login.INVALID_WALLET : en.login.INVALID_WALLET
                    } else {
                      alert(info.err)
                    }
                  }
                }
              })
            })
          }
        })
      },
      showLoginLoadingModal(){
        let title = (LangStorage.getLang('zh') === "zh") ? zh.login.waiting : en.login.waiting
        let content = (LangStorage.getLang('zh') === "zh") ? zh.login.waitingInfo : en.login.waitingInfo
        let payload = {
          title:title,
          content:content,
          isShowCloseButton:false
        }
        this.$store.dispatch('showLoadingModals',payload)
      },
      getOntIdProjectList($info,_self){
        _self.$store.dispatch('getOntIdToken', $info).then( res => {
          _self.$cookies.set("token",this.ontIdProjectInfo.info.token,this.ontIdProjectInfo.info.expires_in)
          _self.$cookies.set("auth_id",this.ontIdProjectInfo.info.auth_id,this.ontIdProjectInfo.info.expires_in)
          _self.$cookies.set("version", PARAM.VERSION, 60 * 60)

          _self.$store.dispatch('loginProjectLibrary').then(res=>{
            _self.$store.dispatch('hideLoadingModals')
            _self.$router.push({ name: 'ProjectList'})


          })
        })
      },
      onFileChange() {
        let files = document.getElementById("exampleInputFile").files
        if (!files.length){
          this.FileName = (LangStorage.getLang('zh') === "zh") ? zh.login.chooseFile : en.login.chooseFile
          document.getElementById('input-file-label').style.color="#a3a3a3";
          return
        }
        this.FileName = files[0].name
        document.getElementById('input-file-label').style.color="#000000";

        this.WalletFile = files[0]
      },
      loginFromGithub(){
        let gitUrl = process.env.GITHUB_GET_CODE+ "&state="+(new Date()).valueOf()
        window.location.href = gitUrl;
      }
    },
  }
</script>

<style scoped>
  .login-smartx-title-text{
    margin-top: 32px;
    font-size: 24px;
    color: white;
  }
  .login-smartx-title-text_ide{
    color: #32a4be;
  }
  .login-title-smartx{
    margin-top: 112px;
    font-size:48px;
  }

  .login-file{
    margin-bottom: 24px;
  }
  .login-password {
    margin-bottom: 48px;
  }
  .login-border {
    border: 1px solid #ffffff;
    border-radius:6px;
    background: #ffffff;
    text-align: center;
    margin-top: 48px;
    margin-bottom: 48px;
    width: 100%;
    padding: 48px 72px 24px 72px;
    box-shadow:0 2px black;
  }
  .login-title {
    color: #041317;
    margin-bottom: 40px;
    font-size: 32px;
  }
  .login-btn-submit {
    width: 296px;
    height: 48px;
    color: white;
    border-color: #32A4BE;
    background: #32A4BE;
    margin-bottom: 32px;
    border-radius: 3px;
    font-size: 18px;
    font-weight: bold;
  }
  .login-btn-submit:hover,
  .login-btn-submit:active {
    background-color: white;
    color: #32A4BE;
  }
  .login-btn-submit:focus{
    box-shadow:none !important;
    outline: none !important;
    background-color: #32A4BE !important;
    border-color: #32A4BE !important;
  }
  .err-message {
    color: #ff0264 !important;
  }
  .input-group-text{
    border-radius:0px;
  }
  .custom-file-input {
    height: 56px;
    width: 100%;
  }
  .login-file-input{
    height: 56px;
  }
  .custom-file-label {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    border: 0px solid #CCCCCC;
    border-right: 0;
    border-radius:3px;
    background-color:#eaedef;
    height: 56px;
    padding: 14px 16px;
    text-align:left;
    line-height: 1.5;
    color: #aab3b4;
    margin-bottom: 0px;
  }
  .custom-file-label::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: block;
    padding: 14px 16px;
    text-align: center;
    content: "Browse";
    width: 100px;
    color: white;
    background-color: #32A4BE;
    height: 56px;
    border-radius:0 3px 3px 0 ;
    cursor: pointer;
  }
  .custom-file-zh-text-label {
    position: absolute;
    top: 14;
    right: 0;
    left: 0;
    border: 0px solid #CCCCCC;
    border-right: 0;
    border-radius:3px;
    background-color:#eaedef;
    height: 56px;
    padding: 14px 16px;
    text-align:left;
    line-height: 1.5;
    color: #aab3b4;
    margin-bottom: 0px;
  }
  .custom-file-zh-text-label::after {
    position: absolute;
    top: 14;
    right: 0;
    bottom: 0;
    display: block;
    padding: 14px 16px;
    color: #FFFFFF;
    background-color: #32A4BE;
    height: 56px;
    width: 100px;
    border-radius:0 3px 3px 0 ;
    content: "浏览";
    text-align: center;
     }
  .login-modal{
     margin-top: 10%;
   }
  .input-group-text{
    width: 54.5px;
  }
  .login-alert{
    height:50px;
    width:100%;
    position:fixed;
    bottom:0;
    margin:0;
    border-radius:0;
  }
  .login-input-append{
    background-color: #ffffff;
    border: 1px solid #CCCCCC;
    border-left: 0;
    color: #CCCCCC;
  }
  .login-error-text{
    text-align:left;
  }

  .login-input{
    border: 0px solid #CCCCCC;
    border-right: 0;
    border-radius:3px;
    background-color:#eaedef;
    height: 56px;
    padding: 14px 16px;
  }
  .login-select{
    height: 45px !important;
    border: 1px solid #CCCCCC;
    border-radius:0px;
  }

  ::-webkit-input-placeholder { /* WebKit browsers */
    color:    #aab3b4;
    font-size: 16px;
  }
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color:    #aab3b4;
    font-size: 16px;
  }
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color:    #aab3b4;
    font-size: 16px;
  }
  :-ms-input-placeholder { /* Internet Explorer 10+ */
    color:    #aab3b4;
    font-size: 16px;
  }
  .login-sign-up{
    color: #32a4be;
    font-size: 18px;
    margin-bottom: 18px;
    cursor: pointer;
  }
  .login-bottom-text{
    font-size: 14px;
    color: #aab3b4;
    cursor: pointer;
    line-height:18px;
  }
  .login-powered-by-ontology-pic{
    margin-bottom: 48px;
    text-align: center;
  }
  .login-powered-by-ontology{
    height: 50px;
    cursor: pointer;
  }
  .login-third—party{
    font-size: 16px;
    color: #aab3b4;
    cursor: pointer;
    line-height:18px;
    margin-bottom: 18px;
  }
  .login-github{
    height: 30px;
    margin-bottom: 18px;
    cursor: pointer;
  }
  .login-add-github{
    margin-top: -20px;
    margin-bottom: 20px;
    font-weight: bold;
  }
  .login-img-waring{
    height: 20px;
    margin-bottom: 4px;
    margin-right: 4px;
  }
</style>

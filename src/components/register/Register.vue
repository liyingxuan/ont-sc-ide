<template>
  <div class="container-fluid">

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-8">

          <div class="register-title-smartx">
            <img class="" src="../../assets/login/logo_smartX_l.png" alt="">
            <legend class="register-smartx-title-text">{{$t('home.smartXInfo_1')}}<span class="register-smartx-title-text_ide">{{$t('home.smartXInfo_green')}}</span>{{$t('home.smartXInfo_2')}}</legend>
          </div>

          <div class="register-border">
            <form @submit.prevent="writeWalletFile">
              <fieldset>
                <legend class="register-title">{{ $t('register.register')}}</legend>

                <div class="form-group register-group">
                  <div class="input-group">
                    <input :type="[isShowPassword ? 'text' : 'password']"
                           v-model="password"
                           v-validate data-vv-rules="required|min:6"
                           class="form-control register-input" name="password" :placeholder="$t('register.enterPassword')">
                  </div>
                  <small class="form-text text-muted err-message register-error-text" v-show="errors.has('password')">{{ errors.first('password') }}</small>
                </div>

                <div class="form-group register-group">
                  <div class="input-group">
                    <input :type="[isShowPassword ? 'text' : 'password']"
                           v-model="passwordAgain"
                           v-validate data-vv-rules="required|min:6|confirmed:password"
                           class="form-control register-input" name="passwordAgain" :placeholder="$t('register.enterPasswordAgain')">
                  </div>
                  <small class="form-text text-muted err-message register-error-text" v-show="errors.has('passwordAgain')">{{ errors.first('passwordAgain') }}</small>
                </div>

              </fieldset>
              <button class="btn btn-outline-success register-btn-submit" @click.prevent="writeWalletFile()">{{ $t('register.generate') }}</button>
            </form>
            <div class="">
              <button class="btn btn-link register-btn-link" @click="recoveryWallet()">{{ $t('register.recovery') }}</button>
            </div>
          </div>
          <div class="register-powered-by-ontology-pic">
            <a :href="OntUrl"><img class="register-powered-by-ontology" src="../../assets/login/powered_by_ontology.png" alt=""></a>
          </div>
        </div>
        <div class="alert alert-dismissible alert-danger register-alert" v-show="isShowRegisterWrongAlert">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
          <strong>{{$t('register.registerWrong')}}</strong> {{$t('register.pleaseCheck')}}
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div class="modal register-modal" id="register-loading" tabindex="-1" role="dialog" >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{$t('register.waiting')}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <label>{{$t('register.waitingInfo')}}</label>
          </div>
          <div class="modal-footer">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import WalletStructure from './../../common/ont-wallet/structure'
  import {SET_REGISTER_INFO} from '../../store/mutation-type'
  import Sleep from './../../helpers/sleep'

	export default {
		name: "register",
    data() {
      return {
        password: '',
        passwordAgain: '',
        isShowPassword: false,
        isShowRegisterWrongAlert: false,
        OntUrl:'https://ont.io/'
      }
    },
    created(){
      this.showTopNavGreen()
    },
    methods: {
      showTopNavGreen(){
        this.$emit('isShowTopNav',false) //Show the white topnav or not //是否显示白色的topnav
        this.$emit('isShowLogoClick', true)//Show the logo click or not //是否使logo点击可返回
      },
      viewPassword() {
        this.isShowPassword = !this.isShowPassword
      },
      writeWalletFile(){
        this.$validator.validateAll().then(result => {
            if (result) {
              $('#register-loading').modal('show')
              WalletStructure.getWalletFile(this.password).then(json => {
              if (json) {
                  this.$store.commit({
                    type : SET_REGISTER_INFO,
                  })
                  // console.log(json)
                  this.$router.push({name: 'RegisterSuccess'})
                  $('#register-loading').modal('hide')
                } else {
                  //failed alert
                  this.isShowRegisterWrongAlert = true
                  $('#register-loading').modal('hide')
                }
              }, err => {
                this.isShowRegisterWrongAlert = true
                $('#register-loading').modal('hide')
              })
            }
        })
      },
      recoveryWallet(){
        this.$router.push({ name:'Recovery'})
      }
    },
	}
</script>

<style scoped>
  .register-background-pic{
    background-image:url(../../assets/login/home_background.png);
    background-repeat:repeat;
  }
  .register-background{
    background: -webkit-linear-gradient(#142B2F, #041317); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#142B2F, #041317); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#142B2F, #041317); /* Firefox 3.6 - 15 */
    background: linear-gradient(#142B2F, #041317); /* 标准的语法 */
  }

  .register-border{
    border: 1px solid #ffffff;
    border-radius:6px;
    background: #ffffff;
    text-align: center;
    margin-top: 48px;
    margin-bottom: 48px;
    width: 100%;
    padding: 48px 72px 56px 72px;
    box-shadow:0 2px black;
  }
  .register-title {
    color: #041317;
    margin-bottom: 40px;
    font-size: 32px;
  }
  .register-group{
    margin-bottom: 24px;
  }
  .register-btn-submit {
    width: 296px;
    height: 48px;
    color: white;
    border-color: #32A4BE;
    background: #32A4BE;
    margin-bottom: 32px;
    margin-top: 24px;
    border-radius: 3px;
    font-size: 18px;
    font-weight: bold;
  }
  .register-btn-submit:hover,
  .register-btn-submit:active {
    background-color: white;
    color: #32A4BE;
  }
  .register-btn-submit:focus{
    box-shadow:none !important;
    outline: none !important;
    background-color: #32A4BE !important;
    border-color: #32A4BE !important;
  }
  .register-smartx-title-text{
    margin-top: 32px;
    font-size: 24px;
    color: white;
  }
  .register-smartx-title-text_ide{
    color: #32a4be;
  }
  .register-title-smartx{
    margin-top: 112px;
    font-size:48px;
  }
  .err-message {
    color: #ff0264 !important;
  }

  .input-group-text{
    border-radius:0px;
  }
  .register-modal{
    margin-top: 10%;
  }
  .register-alert{
    height:50px;
    width:100%;
    position:fixed;
    bottom:0;
  }
  .register-input-append{
    background-color: #ffffff;
    border: 1px solid #CCCCCC;
    border-left: 0;
    color: #CCCCCC;
  }
  .register-input{
    border: 0px solid #CCCCCC;
    border-right: 0;
    border-radius:3px;
    background-color:#eaedef;
    height: 56px;
    padding: 8px 17.6px;
  }
  .register-btn-link{
    color: #32a4be;
    font-size: 18px;
    cursor: pointer;
  }
  .register-btn-link:hover,
  .register-btn-link:active {
    text-decoration:none;
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
  .register-powered-by-ontology-pic{
    text-align: center;
  }
  .register-powered-by-ontology{
    height: 50px;
    margin-bottom: 48px;
    cursor: pointer;
  }
  .register-error-text{
    text-align:left;
  }
</style>

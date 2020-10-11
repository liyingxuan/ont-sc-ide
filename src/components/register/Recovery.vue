<template>
  <div class="container-fluid">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-8">

          <div class="recovery-title-smartx">
            <img class="" src="../../assets/login/logo_smartX_l.png" alt="">
            <legend class="recovery-smartx-title-text">{{$t('home.smartXInfo_1')}}<span class="recovery-smartx-title-text_ide">{{$t('home.smartXInfo_green')}}</span>{{$t('home.smartXInfo_2')}}</legend>
          </div>

          <div class="recovery-border">
            <form @submit.prevent="writeWalletFile">
              <fieldset>
                <legend class="recovery-title">{{ $t('recovery.recovery')}}</legend>

                <div class="form-group recovery-group">
                  <div class="input-group">
                    <input :type="[isShowPassword ? 'text' : 'password']"
                           v-model="privateKey"
                           v-validate data-vv-rules="required|verify_private_key"
                           class="form-control recovery-input " name="privateKey" :placeholder="$t('recovery.enterPrivateKey')">
                    <div class="input-group-append" @click="viewPassword">
                      <span class="input-group-text recovery-input-append">
                        <i class="fa" :class="[isShowPassword ? 'fa-eye' : 'fa-eye-slash']" aria-hidden="true"></i>
                      </span>
                    </div>
                  </div>
                  <small class="form-text text-muted err-message recovery-error-text" v-show="errors.has('privateKey')">{{ errors.first('privateKey') }}</small>
                </div>

                <div class="form-group recovery-group">
                  <div class="input-group">
                    <input :type="[isShowPassword ? 'text' : 'password']"
                           v-model="password"
                           v-validate data-vv-rules="required|min:6"
                           class="form-control recovery-input" name="password" :placeholder="$t('recovery.enterPassword')">
                  </div>
                  <small class="form-text text-muted err-message recovery-error-text" v-show="errors.has('password')">{{ errors.first('password') }}</small>
                </div>

                <div class="form-group recovery-group">
                  <div class="input-group">
                    <input :type="[isShowPassword ? 'text' : 'password']"
                           v-model="passwordAgain"
                           v-validate data-vv-rules="required|min:6|confirmed:password"
                           class="form-control recovery-input" name="passwordAgain" :placeholder="$t('recovery.enterPasswordAgain')">
                  </div>
                  <small class="form-text text-muted err-message recovery-error-text" v-show="errors.has('passwordAgain')">{{ errors.first('passwordAgain') }}</small>
                </div>

              </fieldset>
              <button class="btn btn-outline-success btn-submit" @click.prevent="writeWalletFile()">{{ $t('recovery.recovery') }}</button>
            </form>
          </div>
          <div class="recovery-powered-by-ontology-pic">
            <a :href="OntUrl"><img class="recovery-powered-by-ontology" src="../../assets/login/powered_by_ontology.png" alt=""></a>
          </div>
        </div>
        <div class="alert alert-dismissible alert-danger recovery-alert" v-show="isShowRecoveryWrongAlert">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
          <strong>{{$t('recovery.recoveryWrong')}}</strong> {{$t('recovery.pleaseCheck')}}
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div class="modal recovery-modal" id="recovery-loading" tabindex="-1" role="dialog" >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{$t('recovery.waiting')}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <label>{{$t('recovery.waitingInfo')}}</label>
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
  import VeeValidate, { Validator } from 'vee-validate'
  import {SET_REGISTER_INFO} from '../../store/mutation-type'
  import Sleep from './../../helpers/sleep'

  export default {
    name: "recovery",
    data() {
      return {
        privateKey:'',
        password: '',
        passwordAgain: '',
        isShowPassword: false,
        isShowRecoveryWrongAlert: false,
        OntUrl:'https://ont.io/'
      }
    },
    created() {
      this.verifyPrivateKey();
      this.showTopNavGreen()
    },
    watch:{
      '$route': 'verifyPrivateKey',
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
        this.$validator.validateAll().then($result => {
          if ($result) {
            $('#recovery-loading').modal('show')
            Sleep.sleep(200).then(() => {
              // let res = WalletStructure.getWalletFile( this.password, this.privateKey )
              WalletStructure.recoveryWallet(this.password, this.privateKey).then((res) => {
                if(res.result && res.error === 0) {
                  this.$store.commit({
                    type : SET_REGISTER_INFO,
                  })
                  this.$router.push({name:'RegisterSuccess'})
                  $('#recovery-loading').modal('hide')
                } else {
                  $('#recovery-loading').modal('hide')
                  this.isShowRecoveryWrongAlert = true
                }
              })
              // if(res) {
              //   this.$store.commit({
              //     type : SET_REGISTER_INFO,
              //   })
              //   this.$router.push({name:'RegisterSuccess'})
              //   $('#recovery-loading').modal('hide')
              // } else {
              //   //failed alert
              //   $('#recovery-loading').modal('hide')
              //   this.isShowRecoveryWrongAlert = true
              // }
            })
          }
        })
      },
      verifyPrivateKey(){
        Validator.extend('verify_private_key', {
          getMessage: '',
          validate: value => new Promise((resolve) => {
            resolve({
              valid: value && value.length === 122
            });
          })
        });
      }
    }
  }
</script>

<style scoped>
  .recovery-border{
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
  .recovery-smartx-title-text{
    margin-top: 32px;
    font-size: 24px;
    color: white;
  }
  .recovery-smartx-title-text_ide{
    color: #32a4be;
  }
  .recovery-title-smartx{
    margin-top: 112px;
    font-size:48px;
  }
  .recovery-title {
    color: #041317;
    margin-bottom: 40px;
    font-size: 32px;
  }
  .recovery-group{
    margin-bottom: 24px;
  }
  .btn-submit {
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

  .btn-submit:hover,
  .btn-submit:active {
    background-color: white;
    color: #32A4BE;
  }
  .btn-submit:focus{
    box-shadow:none !important;
    outline: none !important;
    background-color: #32A4BE !important;
    border-color: #32A4BE !important;
  }
  .btn-submit:disabled {
    border-color:#C4C3C3;
    background-color:white;
    color:#C4C3C3;
  }

  .err-message {
    color: #ff0264 !important;
  }

  .input-group-text{
    border-radius:3px;
  }
  .recovery-modal{
    margin-top: 10%;
  }
  .recovery-alert{
    height:50px;
    width:100%;
    position:fixed;
    bottom:0;
  }
  .recovery-input-append{
    border: 0px solid #cccccc;
    background:#eaedef ;
    color:    #aab3b4;
    font-size: 16px;
    cursor: pointer;
    padding: 8px 17.6px;
  }
  .recovery-input{
    border: 0px solid #CCCCCC;
    border-right: 0;
    border-radius:3px;
    background-color:#eaedef;
    height: 56px;
    padding: 8px 17.6px;
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
  .recovery-powered-by-ontology-pic{
    text-align: center;
    cursor: pointer;
  }
  .recovery-powered-by-ontology{
    height: 50px;
    margin-bottom: 48px;
  }
  .recovery-error-text{
    text-align:left;
  }
</style>

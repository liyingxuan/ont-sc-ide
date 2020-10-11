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

        <legend class="register-title">{{$t('registerSuccess.savePrivateKey')}}</legend>

        <div class="field">
          <p class="register-text">{{ $t('registerSuccess.privateKey_1') }}</p>
          <p class="register-text">{{ $t('registerSuccess.privateKey_2') }}</p>

          <button v-show="!isShowPrivate" class="btn btn-outline-success register-success-btn-display"
                  @click="showPrivatekey">{{ $t('registerSuccess.display') }}</button>


<!--          <input v-show="isShowPrivate" :type="[isShowPrivate ? 'text' : 'password']" readonly v-model="keystring"
                 @input="handleInputPrivate" class="form-control register-success-input" id="privateKeyInput">-->

          <textarea id="privateKeyInput" v-show="isShowPrivate" class="form-control register-success-input" cols="40" readonly>{{keystring}}</textarea>


          <button class="btn btn-outline-success register-success-btn-copy" @click="copyPrivatekey" data-clipboard-target="#privateKeyInput" >{{ $t('registerSuccess.copy') }}</button>
          <button class="btn btn-outline-success register-success-btn-next" @click="toNext">{{ $t('registerSuccess.next') }}</button>
        </div>


        <!--<div class="field">-->
          <!--<p class="register-success-text">{{ $t('registerSuccess.privateKey') }}</p>-->
          <!--<div class="form-group">-->
            <!--<div class="input-group ">-->
              <!--<input :type="[isShowPrivate ? 'text' : 'password']" readonly v-model="keystring" @input="handleInputPrivate" class="form-control register-success-input-font register-success-input">-->
              <!--<div class="input-group-append" @click="viewPrivate">-->
                <!--<span class="input-group-text register-success-check-hand register-success-input-append" >-->
                  <!--<i class="fa" :class="[isShowPrivate ? 'fa-eye' : 'fa-eye-slash']" aria-hidden="true"></i>-->
                <!--</span>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->


        <!--<div class="field">-->
          <!--<button class="btn btn-outline-success register-success-btn-next" data-toggle="modal" data-target="#notice">-->
            <!--{{ $t('registerSuccess.next') }}-->
          <!--</button>-->
        <!--</div>-->
      </div>
          <div class="register-success-powered-by-ontology-pic">
            <a :href="OntUrl"><img class="register-success-powered-by-ontology" src="../../assets/login/powered_by_ontology.png" alt=""></a>
          </div>
        </div>
      </div>

    </div>

    <div class="modal fade" id="notice" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t('registerSuccess.notice')}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>{{$t('registerSuccess.info')}}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary register-success-dialog-btn" @click="back2Login">{{$t('registerSuccess.go2Login')}}</button>
            <button type="button" class="btn btn-secondary register-success-dialog-btn-close" data-dismiss="modal">{{ $t('registerSuccess.cancel') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import WriteAndReadWallet from "./../../common/ont-wallet/file-generate-and-get";
  import {EMPTY_REGISTER_INFO} from '../../store/mutation-type'
  import Clipboard from 'clipboard';


  export default {
    name: "downloadWallet",
    data() {
      return {
        isShowPrivate: false,
        OntUrl:'https://ont.io/'
      };
    },
    created(){
      this.showTopNavGreen()
    },
    computed: {
      wallet: function () {
        let walletStr = sessionStorage.getItem("wallet");
        let wallet;
        if (walletStr) {
          wallet = JSON.parse(walletStr);
        }
        return wallet;
      },
      keystring: function () {
        let privatekey = sessionStorage.getItem("privateKey");
        const keystring = privatekey
        return keystring;
      }
    },
    methods: {
      showTopNavGreen(){
        this.$emit('isShowTopNav',false) //Show the white topnav or not //是否显示白色的topnav
        this.$emit('isShowLogoClick', true)//Show the logo click or not //是否使logo点击可返回
      },
      viewPrivate() {
        this.isShowPrivate = !this.isShowPrivate;
      },
      handleInputPrivate() {
        this.privateKey = "123456";
      },

      back2Login() {
        $("#notice").modal("hide");
        this.$store.commit({
          type : EMPTY_REGISTER_INFO,
        })
        this.$router.push({
          name: "Login"
        });
      },
      handleDownload() {
        let walletStr = JSON.parse(sessionStorage.getItem("wallet"));
        if( typeof walletStr === 'string') {
          walletStr = JSON.parse(walletStr)
        }
        if (walletStr) {
          WriteAndReadWallet.downloadFile(walletStr,"ontWallet.keystore")
        }
      },
      toNext(){
        this.$router.push({
          name: "Login"
        });
      },
      copyPrivatekey(){
        let clipboard = new Clipboard('.register-success-btn-copy');
      },
      showPrivatekey(){
        this.isShowPrivate = true
      }
    }
  };

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
  .register-success-height{
    height: 100%;
  }
  .register-border {
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

  .register-border div:last-child {
    margin: 0;
  }
  .register-title {
    color: #041317;
    margin-bottom: 32px;
    font-size: 32px;
  }
  .field {
    color: rgb(52, 52, 52);
    font-size: 19px;
    margin-bottom: 5%;
    width: 100%;
  }

  .field p {
    font-family: inherit;
  }

  .field button {
    width: 100%;
    height: 3rem;
    border-radius: 0;
    cursor: pointer;
  }

  .field input {
    background: #ecf0f1;
  }

  .field input:focus {
    border: 1px solid #32A4BE;
    outline: none;
  }

  .register-success-btn-next {
    color: white;
    background-color: #32A4BE;
    border: 1px solid #32A4BE;
    width: 296px !important;
    height: 48px;
    margin-bottom: 32px;
    border-radius: 3px;
    font-size: 18px;
    font-weight: bold;
  }
  .register-success-btn-next:hover,
  .register-success-btn-next:active {
    background-color: white;
    color: #32A4BE;
  }
  .register-success-btn-next:focus{
    box-shadow:none !important;
    outline: none !important;
    background-color: #32A4BE !important;
    border-color: #32A4BE !important;
  }
  .register-success-btn-copy {
    width: 296px !important;
    height: 48px;
    color: #32A4BE;
    border-color: #32A4BE;
    background: white;
    margin-bottom: 24px;
    border-radius: 3px;
    font-size: 18px;
    margin-top: 32px;
    font-weight: bold;
  }
  .register-success-btn-copy:hover,
  .register-success-btn-copy:active {
    background-color: #32A4BE;
    color: white;
  }
  .register-success-btn-copy:focus{
       box-shadow:none !important;
       outline: none !important;
       background-color: #32A4BE !important;
       border-color: #32A4BE !important;
     }
  .register-success-btn-display{
    border: 0px solid #CCCCCC;
    border-right: 0;
    border-radius:3px;
    background-color:#eaedef;
    height: 39px !important;
    margin-top: 24px;
    color: #32A4BE;
  }

  .register-success-dialog-btn-close{
    border-radius:0px;
  }
  .register-success-dialog-btn{
    background-color: #32A4BE;
    border-radius:0px;
  }

  .register-success-input{
    border: 0px solid #CCCCCC;
    border-right: 0;
    border-radius:3px;
    background-color:#eaedef;
    height: 40px !important;
    margin-top: 36px !important;
    font-size: 14px;
    resize:none;
    padding: 8px 17.6px;
  }
  .register-text{
    font-size: 14px;
    color: #aab3b4;
    line-height:4px;
  }
  .register-success-powered-by-ontology-pic{
    text-align: center;
    cursor: pointer;
  }
  .register-success-powered-by-ontology{
    height: 50px;
    margin-bottom: 48px;
  }
</style>

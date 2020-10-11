<template>
  <div class="container-fluid">
    <div class="Subhead">
      <div class="Subhead-heading">{{ $t('setting.ontid')}}</div>
    </div>
    <div class="sc-setting-info">
      <div class="sc-setting-info-title">{{ $t('settingOntId.title')}}</div>
      <div v-show="showOntID" class="sc-setting-info-content">{{ontId}}</div>
      <div v-show="!showOntID" class="sc-setting-info-content">{{ $t('settingOntId.noAccount')}}</div>
    </div>
    <div class="sc-setting-info">
      <button v-show="showOntID & showDeletcOntId" class="btn btn-outline-success sc-setting-delete" @click="deleteOntId" >{{ $t('settingOntId.removeBinding')}}</button>
      <button v-show="!showOntID" class="btn btn-outline-success sc-setting-submit" @click="showAddOntIDModal" >{{ $t('settingOntId.binding')}}</button>
    </div>

    <div class="modal fade sc-setting-ontid-modal" id="AddOntIdModal" tabindex="-1" role="dialog" >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ $t('settingOntId.chooseOntId')}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <div class="custom-file sc-setting-ontid-custom-file">
                <input type="file" @change="onFileChange" class="sc-setting-ontid-custom-file-input" id="exampleInputFileInDeploy" aria-describedby="fileHelp"
                       name="file" v-validate data-vv-rules="required">
                <label id="sc-setting-ontid-input-file-label" class="sc-setting-ontid-custom-file-label" for="exampleInputFileInDeploy" >{{FileName}}</label>
              </div>
              <small class="form-text text-muted sc-setting-ontid-err-message" v-show="errors.has('file')">{{ errors.first('file') }}</small>
            </div>
            <div class="form-group">
              <div class="input-group">
                <input :type="[isShowPassword ? 'text' : 'password']"
                       v-model="password"
                       v-validate data-vv-rules="required|min:6"
                       class="form-control sc-setting-ontid-input" name="password" :placeholder="$t('deploy.enterPw')">
                <div class="input-group-append sc-setting-ontid-input-group-append" @click="viewPassword">
                    <span class="input-group-text">
                      <i class="fa" :class="[isShowPassword ? 'fa-eye' : 'fa-eye-slash']" aria-hidden="true"></i>
                    </span>
                </div>
              </div>
              <small class="form-text text-muted sc-setting-ontid-err-message" v-show="errors.has('password')">{{ errors.first('password') }}</small>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary sc-setting-ontid-dialog-btn-close" data-dismiss="modal">{{$t('deploy.close')}}</button>
            <button type="button" class="btn btn-primary sc-setting-ontid-dialog-btn" v-bind:disabled="waitingUnlockWallet" :data-dismiss="[closeDialog ? 'modal' : '']" @click="unlockWalletFile">{{waitingUnlockWallet ? $t('settingOntId.wait') : $t('settingOntId.bind')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import URL_API from "../../../config/prod.env"
  import axios from "axios/index";
  import Sleep from './../../helpers/sleep'
  import FileHelper from './../../common/ont-wallet/file-generate-and-get'
  import GetWalletFileMsg from './../../common/ont-wallet/info'
  import {mapState} from 'vuex'
  import * as types from './../../store/mutation-type'
  import LangStorage from './../../helpers/lang'
  import zh from './../../common/lang/zh'
  import en from './../../common/lang/en'

  export default {
    name: "setting-ontid",
    data(){
      return{
        ontId: '',
        githubId: '',
        showOntID: true,
        showDeletcOntId: false,
        password: '',
        isShowPassword: false,
        FileName: '',
        closeDialog : false,
        waitingUnlockWallet: false,
      }
    },
    created(){
      this.getUserOntIdInfo()
    },
    computed: {
      ...mapState({
        addOntIdInfoFalse: state => state.LoginPage.AddOntIdInfoFalse,
      }),
    },
    methods:{
      getUserOntIdInfo(){
        let url = process.env.PROJECT_LIBRARY_URL + "/user/info"
        axios.post(url).then(res => {

          console.log(res.data)
          let userInfo = res.data
          this.ontId = userInfo.data.name
          this.githubId = userInfo.data.github_id
          if(!this.ontId){
            this.showOntID = false
          }
          if(this.githubId){
            this.showDeletcOntId = true
          }

        }).catch(err => {
          console.log(err)
        })
      },
      showAddOntIDModal(){
        this.getInputFileText()
        $('#AddOntIdModal').modal('show')
      },
      getInputFileText(){
        if(LangStorage.getLang('zh') === "zh"){
          let p=document.getElementById('sc-setting-ontid-input-file-label');
          p.setAttribute("class","sc-setting-ontid-custom-zh-text-file-label");
        }else{
          let p=document.getElementById('sc-setting-ontid-input-file-label');
          p.setAttribute("class","sc-setting-ontid-custom-file-label");
        }
        this.FileName = (LangStorage.getLang('zh') === "zh") ? zh.deploy.chooseFile : en.deploy.chooseFile
      },
      onFileChange() {
        let files = document.getElementById("exampleInputFileInDeploy").files
        if (!files.length){

          this.FileName = (LangStorage.getLang('zh') === "zh") ? zh.login.chooseFile : en.login.chooseFile
          return
        }
        this.FileName = files[0].name
        this.WalletFile = files[0]
      },
      viewPassword() {
        this.isShowPassword = !this.isShowPassword
      },
      unlockWalletFile(){
        this.$validator.validateAll().then(result => {
          if (result) {
            this.waitingUnlockWallet = true
            Sleep.sleep(200).then(() => {
              FileHelper.readWalletFile(this.WalletFile).then( (walletFile) => {
                if(walletFile) {
                  let info = GetWalletFileMsg.decryptWalletFile(walletFile, this.password)
                  if(info ) {
                    this.privateKey = info.privateKey
                    this.ontId = info.ontid
                    let payload = {
                      privateKey: info.privateKey,
                      ontid: info.ontid,
                    }
                    let _self = this
                    this.$store.dispatch('addOntIdforUser',payload).then( ($res) => {

                      $("#AddOntIdModal").modal("hide");
                      if(_self.addOntIdInfoFalse.status){
                        this.showAddOntIdFalseModal()
                        this.closeModal()
                      }else{
                        location.reload()
                      }
                    })
                  }
                }
              })
              this.waitingUnlockWallet = false
            })
          }else{
          }
        })
      },
      closeModal(){
        this.$store.commit({
          type : types.ADD_ONTID_INFO_FALSE,
          info : false
        })
      },
      showAddOntIdFalseModal(){
        let title = (LangStorage.getLang('zh') === "zh") ? zh.settingOntId.bindFalse : en.settingOntId.bindFalse
        let content = (LangStorage.getLang('zh') === "zh") ? zh.settingOntId.accountExist : en.settingOntId.accountExist
        let payload = {
          title:title,
          content:content,
          isShowCloseButton:true
        }
        this.$store.dispatch('showLoadingModals',payload)
      },
      deleteOntId(){
        let url = process.env.PROJECT_LIBRARY_URL + "/user/ontid/delete"

        axios.post(url).then(res => {
          console.log(res)
          location.reload()
        }).catch(err => {
          console.log(err)
        })

      },
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
    min-width: 140px;
    height: 40px;
    color: white;
    border-color: #32A4BE;
    background: #32A4BE;
    margin-bottom: 28px;
    border-radius: 3px;
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
  .sc-setting-ontid-modal{
    margin-top: 10%;
  }
  .sc-setting-ontid-custom-file{
    height: 40px;
  }
  .sc-setting-ontid-custom-file-input {
    height: 40px;
    width: 100%;
  }
  .sc-setting-ontid-custom-file-label {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 40px;
    padding: 6px 12px;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    border: 1px solid #ced4da;
    border-left: 1px solid #BCBEC1;
    margin-bottom: 0px;
    border-radius:3px;
    font-weight: normal;
  }
  .sc-setting-ontid-custom-file-label::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: block;
    padding: .5rem .75rem;
    color: #495057;
    content: "Browse";
    background-color: #e9ecef;
    border-left: 1px solid #BCBEC1;
    min-width: 55px;
    text-align: center;
  }
  .sc-setting-ontid-custom-zh-text-file-label {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 40px;
    padding: 6px 12px;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    border: 1px solid #ced4da;
    border-left: 1px solid #BCBEC1;
    margin-bottom: 0px;
    border-radius:3px;
    font-weight: normal;
  }
  .sc-setting-ontid-custom-zh-text-file-label::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: block;
    padding: .5rem .75rem;
    color: #495057;
    content: "浏览";
    background-color: #e9ecef;
    border-left: 1px solid #BCBEC1;
    min-width: 55px;
    text-align: center;
  }
  .sc-setting-ontid-err-message {
    color: #ff0264 !important;
  }
  .sc-setting-ontid-input{
    width: 70%;
    border-radius:3px;
  }
  .sc-setting-ontid-dialog-btn{
    background-color: #36a3bc;
    border-radius:3px;
  }
  .sc-setting-ontid-dialog-btn-close{
    border-radius:3px;
  }
  .sc-setting-ontid-text{
    font-size: 16px;
  }
  .sc-setting-ontid-modal{
    margin-top: 10%;
  }
</style>

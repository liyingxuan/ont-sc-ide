<template>
  <div class="container-fluid open-abi-height">
    <div class="row open-abi-height">
      <div class="col-lg-8 offset-lg-2 col-md-8 offset-md-2 col-sm-10 offset-sm-1 col-xs-12 open-abi-height">
        <div class="open-abi-border">

          <div>
            <label class="nav-link open-abi-txt" >{{$t('openABIFile.inputScName')}}</label>
            <div class="open-abi-input">
              <input class="form-control" v-validate data-vv-rules="required" name="projectName" :placeholder="$t('openABIFile.scName')" v-model="projectName" >
              <small class="form-text text-muted open-abi-err-message" v-show="errors.has('projectName')">{{ errors.first('projectName') }}</small>
            </div>
          </div>

          <div>
            <label class="nav-link open-abi-txt" >{{$t('openABIFile.chooseAbiFile')}}</label>
            <div class="open-abi-input">
              <div class="form-group open-abi-file">
                <div class="input-group open-abi-file-input">
                  <div class="custom-file open-abi-file-input">
                    <input type="file" @change="onFileChange" class="open-abi-file-input" id="exampleInputFile" aria-describedby="fileHelp"
                           name="file" v-validate data-vv-rules="required">
                    <label id="input-file-label" class="open-abi-file-label" for="exampleInputFile" >{{FileName}}</label>
                  </div>
                </div>
                <small class="form-text text-muted open-abi-err-message" v-show="errors.has('file')">{{ errors.first('file') }}</small>
              </div>
            </div>
          </div>

          <div>
            <div class="open-abi-btn">
              <button class="btn btn-outline-success open-abi-btn-submit" @click="toSCIde()">{{ $t('createSc.ok') }}</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import zh from './../../common/lang/zh'
  import en from './../../common/lang/en'
  import LangStorage from './../../helpers/lang'
  import FileHelper from "./../../common/ont-wallet/file-generate-and-get";
  import {PROJECT_LANGAUGE} from '../../helpers/consts'
  let Ont = require('ontology-ts-sdk');

  export default {
    props: ['useChineseLanguage'],
    name: "open-abi-file",
    data(){
      return {
        projectName: '',
        projectLanguage:PROJECT_LANGAUGE.ABI,
        FileName: '',
        ABIFile:'',
        contractInfo:'',
        abiInfo:'',
        nvmInfo:'',
        contractHash:'',
        failInfo:''
      }
    },
    created(){
      this.showTopNavGreen()
    },
    mounted(){
      this.getInputFileText()
    },
    computed: {
      ...mapState({
        ProjectName: state => state.ProjectInfoPage.ProjectName,
        projectList: state => state.ProjectListPage.ProjectList,
      })
    },
    watch: {
      'useChineseLanguage': 'getInputFileText',
    },
    methods: {
      showTopNavGreen(){
        this.$emit('isShowTopNav',false) //Show the white topnav or not //是否显示白色的topnav
        this.$emit('isShowLogoClick', false)//Show the logo click or not //是否使logo点击可返回
      },
      showLoadingModal($title,$content,$isShowCloseButton){
        let payload = {
          title:$title,
          content:$content,
          isShowCloseButton:$isShowCloseButton
        }
        this.$store.dispatch('showLoadingModals',payload)
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

        this.ABIFile = files[0]

      },
      getInputFileText(){
        if(LangStorage.getLang('zh') === "zh"){
          let p=document.getElementById('input-file-label');
          p.setAttribute("class","open-abi-file-zh-text-label");
        }else{
          let p=document.getElementById('input-file-label');
          p.setAttribute("class","open-abi-file-label");
        }
        this.FileName = (LangStorage.getLang('zh') === "zh") ? zh.login.chooseFile : en.login.chooseFile
      },
      toSCIde(){
        let _self = this
        this.$validator.validateAll().then(result => {
          if (result) {
            let title = (LangStorage.getLang('zh') === "zh") ? zh.createSc.waiting : en.createSc.waiting
            let content = (LangStorage.getLang('zh') === "zh") ? zh.createSc.waitingInfo : en.createSc.waitingInfo
            this.showLoadingModal(title,content,false)

            for(let i = 0;i<this.projectList.info.length;i++){
              if(this.projectName === this.projectList.info[i].name){
                if(this.projectLanguage === this.projectList.info[i].language){
                  this.failInfo = (LangStorage.getLang('zh') === "zh") ? zh.openABIFile.projectNameExist : en.openABIFile.projectNameExist
                  let title = (LangStorage.getLang('zh') === "zh") ? zh.createSc.createProjectFail : en.createSc.createProjectFail
                  this.showLoadingModal(title,this.failInfo,true)
                  return
                }
              }
            }

            this.getAbiInfo().then($res => {
              if(!$res){
                let title = (LangStorage.getLang('zh') === "zh") ? zh.createSc.createProjectFail : en.createSc.createProjectFail
                this.showLoadingModal(title,this.failInfo,true)
                return false
              }else{
                _self.nvmInfo = _self.contractInfo.Result.Code
                let payload = {
                  projectName : _self.projectName,
                  language : _self.projectLanguage,

                }
                _self.makeProject(payload,_self)
              }
            })
          }
        })
      },
      getAbiInfo(){
        let _self = this
        return FileHelper.readWalletFile(this.ABIFile).then( ($ABIFile) => {

          let abiFileJson = JSON.parse($ABIFile)
          _self.abiInfo = abiFileJson.abi
          _self.contractHash = abiFileJson.contractHash
          if(_self.contractHash === undefined){
            _self.failInfo = (LangStorage.getLang('zh') === "zh") ? zh.openABIFile.openAbiFileFail : en.openABIFile.openAbiFileFail
            return false
          }

          let restClient = new Ont.RestClient(process.env.NODE_URL)

          return restClient.getContractJson(_self.contractHash).then(function (result) {
            _self.contractInfo = result
            if(_self.contractInfo.Error !== 0){
              _self.failInfo = (LangStorage.getLang('zh') === "zh") ? zh.openABIFile.contractHashWrong : en.openABIFile.contractHashWrong
             return false
            }else{
             return true
            }
          })
        })
      },
      makeProject($payload,$_self){
        $_self.$store.dispatch('makeProject',$payload).then(function(res){
            let param={
              id: $_self.ProjectName.info.id,
              nvm_byte_code: $_self.nvmInfo,
              abi: JSON.stringify($_self.abiInfo),
              contract_hash: $_self.contractHash
            }
            $_self.$store.dispatch('saveProject', param).then(function(res){
              $_self.setCookies($_self.ProjectName.info)
              $_self.$store.dispatch('hideLoadingModals')
              $_self.$router.push({ name:'IDE', params:{projectName:$_self.projectName,isCreateProject:true}})
            })
        })
      },
      setCookies($project) {
        this.$cookies.set("projectName", $project.projectName, 60 * 60)
        this.$cookies.set("projectLanguage", $project.language, 60 * 60)
        this.$cookies.set("projectID", $project.id, 60 * 60)
      },
    }
  }
</script>

<style scoped>
  .open-abi-height{
    height: 100%;
  }
  .open-abi-border{
    width: 100%;
    padding: 6% 6% 6% 6%;
  }
  .open-abi-txt{
    color: #32A4BE;
  }
  .open-abi-input{
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 1%;
    padding-bottom: 1%;
  }
  .open-abi-btn {
    margin-top: 2%;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 1%;
    padding-bottom: 6%;
  }
  .open-abi-btn-submit {
    border-radius: 0;
    width: 100%;
    color: #32A4BE;
    border-color: #32A4BE;
  }
  .open-abi-btn-submit:hover,
  .open-abi-btn-submit:active {
    background-color: #32A4BE;
    color: white;
  }
  .open-abi-err-message {
    color: #ff0264 !important;
  }

  input{
    border-radius:0px;
  }
  ::-webkit-input-placeholder { /* WebKit browsers */
    color:    #CCCCCC;
  }
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color:    #CCCCCC;
  }
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color:    #CCCCCC;
  }
  :-ms-input-placeholder { /* Internet Explorer 10+ */
    color:    #CCCCCC;
  }
  .open-abi-file-input {
    height: 56px;
    width: 100%;
  }
  .open-abi-file-input{
    height: 38px;
  }
  .open-abi-file-label {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    border: 1px solid #ced4da;
    border-right: 0;
    background-color:white;
    height: 38px;
    padding: 6px 12px;
    text-align:left;
    line-height: 1.5;
    color: #aab3b4;
    margin-bottom: 0;
    border-radius: 0;
  }
  .open-abi-file-label::after {
    position: absolute;
    top: -1px;
    right: 0;
    bottom: 0;
    display: block;
    padding: 6px 12px;
    text-align: center;
    content: "Browse";
    width: 100px;
    color: white;
    background-color: #32A4BE;
    height: 38px;
    cursor: pointer;
    border-radius: 0;
  }
  .open-abi-file-zh-text-label {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    border: 1px solid #ced4da;
    border-right: 0;
    background-color:white;
    height: 38px;
    padding: 6px 12px;
    text-align:left;
    line-height: 1.5;
    color: #aab3b4;
    margin-bottom: 0;
    border-radius: 0;
  }
  .open-abi-file-zh-text-label::after {
    position: absolute;
    top: -1px;
    right: 0;
    bottom: 0;
    display: block;
    padding: 6px 12px;
    text-align: center;
    content: "浏览";
    width: 100px;
    color: white;
    background-color: #32A4BE;
    height: 38px;
    cursor: pointer;
    border-radius: 0;
  }
  .open-abi-select{
    border: 1px solid #ced4da;
    height: 38px !important;
    padding: 6px 12px;
    border-radius:0;
    -webkit-border-radius:0;
    -moz-border-radius:0;
  }

</style>

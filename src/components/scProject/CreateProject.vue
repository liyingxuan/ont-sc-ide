<template>
  <div class="container-fluid create-sc-height">
    <div class="row create-sc-height">
      <div class="col-lg-8 offset-lg-2 col-md-8 offset-md-2 col-sm-10 offset-sm-1 col-xs-12 create-sc-height">
        <div class="create-sc-border">
          <div>
            <label class="nav-link create-sc-txt" >{{$t('createSc.chooseTemplate')}}</label>
            <div class="create-sc-select">
              <div class="form-group">
                <select  size="5" class="form-control create-sc-select-content" @change="chooseProjectTemplate()" id="select-template" name="select-template">
                  <option value="0" selected>{{$t('createSc.null')}}</option>
                  <option v-for="template in projectTemplate.info" :value='template.id'>{{template.name}}</option>
                </select>
              </div>
              <div class="create-sc-template-info">
                <div class="create-sc-template-info-text">{{projectTemplateInfo}}</div>
              </div>
            </div>
          </div>

          <div>
            <label class="nav-link create-sc-txt" >{{$t('createSc.inputScName')}}</label>
            <div class="create-sc-input">
              <input class="form-control" v-validate data-vv-rules="required" name="projectName" :placeholder="$t('createSc.scName')" v-model="projectName" >
              <small class="form-text text-muted create-sc-err-message" v-show="errors.has('projectName')">{{ errors.first('projectName') }}</small>
            </div>
            <div class="create-sc-btn">
              <button class="btn btn-outline-success create-sc-btn-submit" @click="toSCIde()">{{ $t('createSc.ok') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import LangStorage from './../../helpers/lang'
  import zh from './../../common/lang/zh'
  import en from './../../common/lang/en'

  export default {
    name: "create-sc",
    data(){
      return {
        projectName: '',
        projectLanguage:'',
        projectTemplateInfo: 'This is an blank template',
        isWasmPage: 'normal',
      }
    },
    created(){
      if(!$.isEmptyObject(this.$route.params.page)) {
        this.isWasmPage = 'wasm'
      }
      this.getProjectLanguageAndTemplate()
      this.showTopNavGreen()
    },
    computed: {
      ...mapState({
        projectTemplate: state => state.ProjectInfoPage.ProjectTemplate,
        projectTemplateCode: state => state.ProjectInfoPage.ProjectTemplateCode,
        ProjectName: state => state.ProjectInfoPage.ProjectName,
        projectList: state => state.ProjectListPage.ProjectList,
      })
    },
    methods: {
      chooseProjectTemplate(){
        let select = document.getElementById("select-template");
        let index = select.selectedIndex ;
        let templateId = select.options[index].value;
        if(templateId === '0'){
          this.projectTemplateInfo = "This is an blank template"
        }else{
          try{
            let template = this.projectTemplate.info
            for(let i=0;i<template.length;i++){
              //类型不同，模糊判断
              if(template[i].id == templateId){
                this.projectTemplateInfo = template[i].desc
              }
            }

          }catch(e){
            this.projectTemplateInfo = "No template introduction"
          }
        }
      },
      showTopNavGreen(){
        this.$emit('isShowTopNav',false) //Show the white topnav or not //是否显示白色的topnav
        this.$emit('isShowLogoClick', false)//Show the logo click or not //是否使logo点击可返回
      },
      toSCIde(){
        this.$validator.validateAll().then(result => {
          if (result) {
            for(let i = 0;i<this.projectList.info.length;i++){
              if(this.projectName === this.projectList.info[i].name){
                if(this.projectLanguage === this.projectList.info[i].language){
                  let title = (LangStorage.getLang('zh') === "zh") ? zh.createSc.createProjectFail : en.createSc.createProjectFail
                  let content = (LangStorage.getLang('zh') === "zh") ? zh.createSc.createProjectFailInfo : en.createSc.createProjectFailInfo
                  this.showLoadingModal(title,content,true)
                  return
                }
              }
            }
            let title = (LangStorage.getLang('zh') === "zh") ? zh.createSc.waiting : en.createSc.waiting
            let content = (LangStorage.getLang('zh') === "zh") ? zh.createSc.waitingInfo : en.createSc.waitingInfo
            this.showLoadingModal(title,content,false)

            let payload = {
              projectName : this.projectName,
              language : this.projectLanguage,
              type: this.isWasmPage
            }
            this.makeProject(payload,this)

          }
        })
      },
      getProjectLanguageAndTemplate(){
        this.projectLanguage = this.$cookies.get("projectLanguage")
        this.$store.dispatch('getProjectTemplate',this.projectLanguage).then(function(res){

        })
      },
      showLoadingModal($title,$content,$isShowCloseButton){
        let payload = {
          title:$title,
          content:$content,
          isShowCloseButton:$isShowCloseButton
        }
        this.$store.dispatch('showLoadingModals',payload)
      },
      makeProject($payload,$_self){
        $_self.$store.dispatch('makeProject',$payload).then(function(res){
          let select = document.getElementById("select-template");
          let index = select.selectedIndex ;
          let templateId = select.options[index].value;
          $_self.$store.dispatch('setProjectTemplate',templateId).then(function(res){
            let param={
              id: $_self.ProjectName.info.id,
              code: $_self.projectTemplateCode.info,
            }
            $_self.$store.dispatch('saveProject', param).then(function(res){
              $_self.setCookies($_self.ProjectName.info)
              $_self.$store.dispatch('hideLoadingModals')
               $_self.$router.push({ name:'IDE', params:{projectName:$_self.projectName,isCreateProject:true}})
            })
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
  .create-sc-height{
    height: 100%;
  }
  .create-sc-border{
    width: 100%;
    padding: 6% 6% 6% 6%;
  }
  .create-sc-txt{
    color: #32A4BE;
  }
  .create-sc-select-content {
    padding:0px 10px 0px 10px;
    height: 120px;
    line-height:1.5;
  }
  select.form-control:not([size]):not([multiple]) {
    height: calc(2.5945rem + 2px);
    border-radius:0px;
  }
  .create-sc-select{
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 1%;
    padding-bottom: 1%;
  }
  .create-sc-input{
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 1%;
    padding-bottom: 1%;
  }
  .create-sc-btn {
    margin-top: 2%;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 1%;
    padding-bottom: 6%;
  }
  .create-sc-btn-submit {
    border-radius: 0;
    width: 100%;
    color: #32A4BE;
    border-color: #32A4BE;
  }
  .create-sc-btn-submit:hover,
  .create-sc-btn-submit:active {
    background-color: #32A4BE;
    color: white;
  }
  .create-sc-err-message {
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
  .create-sc-template-info{
    width: 100%;
    border: 1px solid #F5F5F5;
    background-color: #F5F5F5;
  }
  .create-sc-template-info-text{
    color: #98999A;
    font-size: 14px;
    margin: 15px 11px 15px 11px;
  }
</style>

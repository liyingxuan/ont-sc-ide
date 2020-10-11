<template>
  <div class="container-fluid sc-id-list-height">
    <div class="row sc-id-list-height justify-content-center">
      <div class="col-lg-9 col-md-9 col-sm-10 col-xs-12 sc-id-list-height" >
        <div class="sc-id-list-border">

          <div>
            <div>
              <label class="sc-id-list-title">{{$t('projectList.createAndRun')}}</label>
            </div>
            <div class="row">
              <div class="sc-id-list-project">
                <button class="btn btn-outline-success sc-id-list-button" @click="toCreateSc" @mouseenter="showCreateWhiteImg(true)" @mouseleave="showCreateWhiteImg(false)">
                  <img v-show="!isShowCreateWhiteImg" src="./../../../src/assets/project/create.png" alt="" class="img_in_btn">
                  <img v-show="isShowCreateWhiteImg" src="./../../../src/assets/project/create-white.png" alt="" class="img_in_btn">
                  {{$t('projectList.createProject')}}
                </button>
                <button class="btn btn-outline-success sc-id-list-button" @click="toOpenAbiFile" @mouseenter="showOpenABIFileImg(true)" @mouseleave="showOpenABIFileImg(false)">
                  <img v-show="!isShowOpenABIFileImg" src="./../../../src/assets/project/abi-file.png" alt="" class="img_in_btn">
                  <img v-show="isShowOpenABIFileImg" src="./../../../src/assets/project/abi-file-whit.png" alt="" class="img_in_btn">
                  {{$t('projectList.openABI')}}
                </button>
                <button class="btn btn-outline-success sc-id-list-edit-button" @click="toLoadingProject" @mouseenter="showRunningWhiteImg(true)" @mouseleave="showRunningWhiteImg(false)" disabled>
                  <img v-show="!isShowRunningWhiteImg" src="./../../../src/assets/project/running.png" alt="" class="img_in_btn">
                  <img v-show="isShowRunningWhiteImg" src="./../../../src/assets/project/running-white.png" alt="" class="img_in_btn">
                  {{$t('projectList.runProject')}}
                </button>
              </div>
            </div>
          </div>

          <div class="sc-id-list-project-list">
            <label class="sc-id-list-title">{{$t('projectList.myProjectList')}}</label>
            <label class="sc-ide-list-edit" v-show="!isProjectListEdit" @click="projectListEdit">{{$t('projectList.edit')}}</label>
            <label class="sc-ide-list-edit-cancel" v-show="isProjectListEdit" @click="projectListEditCancel">{{$t('projectList.cancel')}}</label>
          </div>

          <label class="sc-id-list-title">Python:</label>
          <div class="row">
            <div class="row" v-if="projectList.info.length !== 0">
              <div v-for="project in projectList.info">
                <div class="sc-ide-list-relative" v-show="project.languageType === 'Py'">
                  <button class="btn btn-outline-success sc-id-list-button" @click="toScIDE(project)" @mouseenter="ShowProjectWhiteImg(project.id)" @mouseleave="ShowProjectWhiteImg(0)">
                    <img v-show="isShowProjectWhiteImg !== project.id" src="./../../../src/assets/project/project.png" alt="" class="img_in_btn">
                    <img v-show="isShowProjectWhiteImg === project.id" src="./../../../src/assets/project/project-white.png" alt="" class="img_in_btn">
                    {{project.name}}
                  </button>
                  <div class="sc-ide-list-corner">
                    <div class="triangle"></div>
                    <div class="desc">{{project.languageType}}</div>
                  </div>
                  <div class="sc-id-list-project-delete" v-show="isProjectListEdit" @click="makeSureDeleteProject(project.id)">
                    <img src="./../../../src/assets/project/delete.png" alt="">
                  </div>
                </div>
              </div>
            </div>
            <div class="sc-ide-text" v-show="isNoPython" >
              <div>{{$t('projectList.noProject')}}</div>
            </div>
          </div>

          <label class="sc-id-list-title" style="margin-top: 16px">C#:</label>
          <div class="row">
            <div class="row" v-if="projectList.info.length !== 0">
              <div v-for="project in projectList.info">
                <div class="sc-ide-list-relative" v-show="project.languageType === 'C#'">
                  <button class="btn btn-outline-success sc-id-list-button" @click="toScIDE(project)" @mouseenter="ShowProjectWhiteImg(project.id)" @mouseleave="ShowProjectWhiteImg(0)">
                    <img v-show="isShowProjectWhiteImg !== project.id" src="./../../../src/assets/project/project.png" alt="" class="img_in_btn">
                    <img v-show="isShowProjectWhiteImg === project.id" src="./../../../src/assets/project/project-white.png" alt="" class="img_in_btn">
                    {{project.name}}
                  </button>
                  <div class="sc-ide-list-corner">
                    <div class="triangle"></div>
                    <div class="desc">{{project.languageType}}</div>
                  </div>
                  <div class="sc-id-list-project-delete" v-show="isProjectListEdit" @click="makeSureDeleteProject(project.id)">
                    <img src="./../../../src/assets/project/delete.png" alt="">
                  </div>
                </div>
              </div>
            </div>
            <div class="sc-ide-text" v-show="isNoCSharp" >
              <div>{{$t('projectList.noProject')}}</div>
            </div>
          </div>

          <label class="sc-id-list-title" style="margin-top: 16px">ABI:</label>
          <div class="row">
            <div class="row" v-if="projectList.info.length !== 0">
              <div v-for="project in projectList.info">
                <div class="sc-ide-list-relative" v-show="project.languageType === 'ABI'">
                  <button class="btn btn-outline-success sc-id-list-button" @click="toScIDE(project)" @mouseenter="ShowProjectWhiteImg(project.id)" @mouseleave="ShowProjectWhiteImg(0)">
                    <img v-show="isShowProjectWhiteImg !== project.id" src="./../../../src/assets/project/project.png" alt="" class="img_in_btn">
                    <img v-show="isShowProjectWhiteImg === project.id" src="./../../../src/assets/project/project-white.png" alt="" class="img_in_btn">
                    {{project.name}}
                  </button>
                  <div class="sc-ide-list-corner">
                    <div class="triangle"></div>
                    <div class="desc">{{project.languageType}}</div>
                  </div>
                  <div class="sc-id-list-project-delete" v-show="isProjectListEdit" @click="makeSureDeleteProject(project.id)">
                    <img src="./../../../src/assets/project/delete.png" alt="">
                  </div>
                </div>
              </div>
            </div>
            <div class="sc-ide-text" v-show="isNoAbi" >
              <div>{{$t('projectList.noProject')}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal:Notice delete-->
    <div class="modal project-list-modal" id="project-list-notice-delete" tabindex="-1" role="dialog" v-show="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{$t('projectList.notice')}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <label>{{$t('projectList.noticeDelete')}}</label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary sc-ide-dialog-btn-close" data-dismiss="modal">{{$t('projectList.cancel')}}</button>
            <button type="button" class="btn btn-primary sc-ide-dialog-btn" @click="deleteProject">{{$t('projectList.ok')}}</button>
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
  import Sleep from './../../helpers/sleep'

  export default {
    name: "scProject",
    data() {
      return {
        isShowCreateWhiteImg: false,
        isShowRunningWhiteImg: false,
        isShowProjectWhiteImg: '',
        isShowOpenABIFileImg: false,
        WASM_URL: 'https://github.com/ontio/ontology-wasm',
        isProjectListEdit: false,
        deleteProjectId: '',
        isNoPython:true,
        isNoCSharp:true,
        isNoAbi:true,
      }
    },
    created() {
      this.showTopNavGreen()
    },
    mounted() {
      let title = (LangStorage.getLang('zh') === "zh") ? zh.projectList.waiting : en.projectList.waiting
      let content = (LangStorage.getLang('zh') === "zh") ? zh.projectList.waitingInfo : en.projectList.waitingInfo
      this.showLoadingModal(title,content,false)
      this.getProjectList();
    },
    watch: {
      '$route': 'getProjectList',
    },
    computed: {
      ...mapState({
        projectList: state => state.ProjectListPage.ProjectList,
      })
    },
    methods: {
      showLoadingModal($title,$content,$isShowCloseButton){
        let payload = {
          title:$title,
          content:$content,
          isShowCloseButton:$isShowCloseButton
        }
        this.$store.dispatch('showLoadingModals',payload)
      },
      deleteProject(){
        $('#project-list-notice-delete').modal('hide')

        let title = (LangStorage.getLang('zh') === "zh") ? zh.projectList.waiting : en.projectList.waiting
        let content = (LangStorage.getLang('zh') === "zh") ? zh.projectList.waitingDelete : en.projectList.waitingDelete
        this.showLoadingModal(title,content,false)
       let param={
          id: this.deleteProjectId
        }
        this.$store.dispatch('deleteProject',param).then(res => {
          this.$store.dispatch('getProjectList').then(res => {
            this.$store.dispatch('hideLoadingModals')
            this.deleteProjectId = ''
          })
        })
      },
      makeSureDeleteProject($id){
        $('#project-list-notice-delete').modal('show')
        this.deleteProjectId = $id
      },
      projectListEdit(){
        this.isProjectListEdit = true
      },
      projectListEditCancel(){
        this.isProjectListEdit = false
      },
      //Vue.js鼠标悬浮更换图片功能 //@mouseenter
      //Vue. Js hover over image. //@mouseenter
      showCreateWhiteImg($index) {
        this.isShowCreateWhiteImg = $index;
      },
      showOpenABIFileImg($index) {
        this.isShowOpenABIFileImg = $index;
      },

      showRunningWhiteImg($index){
        this.isShowRunningWhiteImg = $index;
      },
      ShowProjectWhiteImg($index){
        this.isShowProjectWhiteImg = $index;
      },
      showTopNavGreen() {
        this.$emit('isShowTopNav',false) //Show the white topnav or not //是否显示白色的topnav
        this.$emit('isShowLogoClick', false)//Show the logo click or not //是否使logo点击可返回
      },
      getProjectList() {
        let _self = this
        this.$store.dispatch('getProjectList').then(res => {

          for(let i=0;i<this.projectList.info.length;i++){
            if(this.projectList.info[i].languageType==="Py"){
              this.isNoPython = false
            }
            if(this.projectList.info[i].languageType==="C#"){
              this.isNoCSharp = false
            }
            if(this.projectList.info[i].languageType==="ABI"){
              this.isNoAbi = false
            }
          }

          Sleep.sleep(200).then(() => {
            _self.$store.dispatch('hideLoadingModals')
          })
        })
      },
      toCreateSc() {
        this.$router.push({name: 'SelectLanguage'})
      },
      toLoadingProject() {
        this.$router.push({name: 'LoadingProject'})
      },
      toScIDE($project) {
        this.setProjectName($project)
        this.setCookies($project)
        this.$router.push({name: 'IDE', params: {projectName: $project.name,isCreateProject:false}})
      },
      setCookies($project) {
        this.$cookies.set("projectName", $project.name, 60 * 60)
        this.$cookies.set("projectLanguage", $project.language, 60 * 60)
        this.$cookies.set("projectID", $project.id, 60 * 60)
      },
      setProjectName($project) {
        let payload = {
          projectName: $project.name,
          language: $project.language,
          id: $project.id
        }
        this.$store.dispatch('setProjectName', payload)

      },
      toOpenAbiFile(){
        this.$router.push({name: 'OpenAbiFile'})
      }
    }
  }
</script>

<style scoped>
  .sc-id-list-height{
    height: 100%;
  }
  .sc-id-list-border{
    /*border:1px solid #C4C3C3;*/
    margin: 5% 0 8% 0;
    width: 100%;
  }
  .img_in_btn {
    width: 27px;
    margin-right: 15px;
  }
  .img_in_btn_hide{
    position: absolute;
    bottom: 0;
  }
  .sc-id-list-link,
  .sc-id-list-project-list{
    margin-top: 4%;
  }
  .sc-id-list-title{
    color: #36a3bc;
    font-size: 18px ;
    text-align: center;
  }
  .sc-id-list-button {
    border-radius: 0;
    width: 270px;
    height: 64px;
    color: #36a3bc;
    border-color: #36a3bc;
    font-size: 18px;
    margin-right: 22px;
    text-align: left;
    padding: 8px 17.6px;
  }
  .sc-id-list-button:hover,
  .sc-id-list-button:active {
    background-color: #36a3bc;
    color: white;
  }
  .sc-id-list-edit-button {
    border-radius: 0;
    width: 270px;
    height: 64px;
    color: #36a3bc;
    border-color: #36a3bc;
    font-size: 18px;
    margin-right: 22px;
    text-align: left;
    padding: 8px 17.6px;
  }
  .sc-id-list-edit-button:hover,
  .sc-id-list-edit-button:active {
    background-color: #FCFCFC;
    color: #36a3bc;
  }
  .sc-id-list-link-button {
    border-radius: 0;
    width: 270px;
    height: 64px;
    line-height: 46px;
    color: #36a3bc;
    border-color: #36a3bc;
    font-size: 18px;
    text-align: left;
  }
  .sc-id-list-link-button:hover,
  .sc-id-list-link-button:active {
    background-color: #36a3bc;
    color: white;
  }
  .sc-id-list-language-button {
    border-radius: 0;
    min-width: 100%;
    min-height: 100%;
    color: #36a3bc;
    border-color: #36a3bc;
    font-size: 18px;

  }
  .sc-id-list-language-button:hover,
  .sc-id-list-language-button:active {
    background-color: #36a3bc;
    color: white;
  }
  .sc-id-list-fasize{
    margin: 0px 16px 0px 0px;
  }
  .sc-ide-list-relative{
    position: relative;
    width: 270px;
    height: 64px;
    margin: 5px -1px 0 30px;
    display:inline-block;
  }
  .sc-ide-list-corner {
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 50px;
    height: 50px;
    overflow: hidden;
  }
  .sc-id-list-project-delete {
    position: absolute;
    bottom: 0px;
    right: -40px;
    top: -13px;
    width: 50px;
    height: 50px;
    overflow: hidden;
    cursor: pointer;
  }
  .sc-ide-list-corner .triangle {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, transparent 50%,#36a3bc 50% );
  }
  .sc-ide-list-corner .desc {
    position: absolute;
    right: 8%;
    bottom: 8%;
    z-index: 1;
    transform: rotate(-45deg);
    color: white;
  }
  .sc-ide-list-label {
    position: absolute;
    border:1px solid #36a3bc;
    left: 0px;
    top: 0px;
    width: 15px;
    height: 100%;
    background: #36a3bc;
    overflow: hidden;
  }
  .sc-id-list-project {
    margin: 5px 15px;
  }
  .project-list-modal{
    margin-top: 10%;
  }
  .sc-ide-text{
    margin-left: 55px;
    font-size: 18px;
    margin-top: 8px;
  }
  .sc-ide-list-edit{
       color: #36a3bc;
       font-size: 14px ;
       text-align: center;
       margin-left: 20px;
       cursor: pointer;
     }
  .sc-ide-list-edit:hover,
  .sc-ide-list-edit:active {
    text-decoration:underline;
    color: green;
  }
  .sc-ide-list-edit-delete{
    color: red;
    font-size: 14px ;
    text-align: center;
    margin-left: 20px;
    cursor: pointer;
  }
  .sc-ide-list-edit-delete:hover,
  .sc-ide-list-edit-delete:active {
    text-decoration:underline;
  }
  .sc-ide-list-edit-cancel{
    color: black;
    font-size: 14px ;
    text-align: center;
    margin-left: 20px;
    cursor: pointer;
  }
  .sc-ide-list-edit-cancel:hover,
  .sc-ide-list-edit-cancel:active {
    text-decoration:underline;
  }
  .sc-ide-dialog-btn{
    background-color: #36a3bc;
    border-radius:0px;
  }
  .sc-ide-dialog-btn-close{
    border-radius:0px;
  }
</style>

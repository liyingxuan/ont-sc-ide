<template>
  <div class="container-fluid sel-lang-height">
    <div class="row sel-lang-center sel-lang-height">
      <div class="col-lg-8 offset-lg-2 col-md-8 offset-md-2 col-sm-10 offset-sm-1 col-xs-12 sel-lang-height">
        <div class="sel-lang-border" v-show="!isWasmPage">
          <div>
            <label class="nav-link sel-lang-txt" >{{$t('selectLanguage.pleaseSelect')}}</label>
          </div>
          <div>
            <button class="btn btn-outline-success sel-lang-button" @click="toCreateProject('1')"  @mouseenter="showCSharpWhiteImg(true)" @mouseleave="showCSharpWhiteImg(false)">
              <img v-show="!isShowCSharpWhiteImg" class="sel-lang-fasize" src="../../assets/language/csharp.png">
              <img v-show="isShowCSharpWhiteImg" class="sel-lang-fasize" src="../../assets/language/csharp-white.png">
              C#
            </button>
          </div>
          <div>
            <button class="btn btn-outline-success sel-lang-button" @click="toCreateProject('2')" @mouseenter="showPythonWhiteImg(true)" @mouseleave="showPythonWhiteImg(false)" >
              <img v-show="!isShowPythonWhiteImg" class="sel-lang-fasize" src="../../assets/language/python.png">
              <img v-show="isShowPythonWhiteImg" class="sel-lang-fasize" src="../../assets/language/python-white.png">
              Python
            </button>
          </div>
          <div>
            <button class="btn btn-outline-success sel-lang-button-disable" @click="toCreateProject('3')" @mouseenter="showJavaScriptWhiteImg(true)" @mouseleave="showJavaScriptWhiteImg(false)" disabled>
              <img v-show="!isShowJavaScriptWhiteImg" class="sel-lang-fasize" src="../../assets/language/javascript.png">
              <img v-show="isShowJavaScriptWhiteImg" class="sel-lang-fasize" src="../../assets/language/javascript-white.png">
              JavaScript
            </button>
          </div>
        </div>

        <div class="sel-lang-border" v-show="isWasmPage">
          <div>
            <label class="nav-link sel-lang-txt" >{{$t('selectLanguage.pleaseSelect')}}</label>
          </div>
          <div>
            <button class="btn btn-outline-success sel-lang-button" @click="toCreateProject('4')"  @mouseenter="showCSharpWhiteImg(true)" @mouseleave="showCSharpWhiteImg(false)">
              <img v-show="!isShowCSharpWhiteImg" class="sel-lang-fasize" src="../../assets/language/c.png">
              <img v-show="isShowCSharpWhiteImg" class="sel-lang-fasize" src="../../assets/language/c-white.png">
              C
            </button>
          </div>
          <div>
            <button class="btn btn-outline-success sel-lang-button" @click="toCreateProject('5')" @mouseenter="showPythonWhiteImg(true)" @mouseleave="showPythonWhiteImg(false)" >
              <img v-show="!isShowPythonWhiteImg" class="sel-lang-fasize" src="../../assets/language/c-plus-plus.png">
              <img v-show="isShowPythonWhiteImg" class="sel-lang-fasize" src="../../assets/language/c-plus-plus-white.png">
              C++
            </button>
          </div>
          <div>
            <button class="btn btn-outline-success sel-lang-button-disable" @click="toCreateProject('6')" @mouseenter="showJavaScriptWhiteImg(true)" @mouseleave="showJavaScriptWhiteImg(false)" disabled>
              <img v-show="!isShowJavaScriptWhiteImg" class="sel-lang-fasize" src="../../assets/language/rust.png">
              <img v-show="isShowJavaScriptWhiteImg" class="sel-lang-fasize" src="../../assets/language/rust-white.png">
              rust
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {PROJECT_LANGAUGE} from '../../helpers/consts'

  export default {
    name: "select-language",
    data(){
      return{
        projectName: '',
        isShowCSharpWhiteImg: false,
        isShowJavaScriptWhiteImg: false,
        isShowPythonWhiteImg: false,
        isWasmPage:false,
      }
    },
    created(){
      this.showTopNavGreen()
      if(!$.isEmptyObject(this.$route.params.page)) {
        this.isWasmPage = true
      }else if(this.$route.path === "/select-language-wasm"){
        this.isWasmPage = true
      }
    },
    methods: {
      showCSharpWhiteImg($index){
        this.isShowCSharpWhiteImg = $index
      },
      showJavaScriptWhiteImg($index){
        this.isShowJavaScriptWhiteImg = $index
      },
      showPythonWhiteImg($index){
        this.isShowPythonWhiteImg = $index
      },
      showTopNavGreen(){
        this.$emit('isShowTopNav',false) //Show the white topnav or not //是否显示白色的topnav
        this.$emit('isShowLogoClick', false)//Show the logo click or not //是否使logo点击可返回
      },
      toCreateProject($projectLanguage){
        this.$cookies.set("projectLanguage",$projectLanguage,60*60)
        if(this.isWasmPage){//Wasm IDE
          this.$router.push({ name:'CreateProjectWASM', params:{projectLanguage:$projectLanguage,page:'wasm'}})
        }else{
          this.$router.push({ name:'CreateProject', params:{projectLanguage:$projectLanguage}})
        }

      },
    }
  }
</script>

<style scoped>
  .sel-lang-height{
    height: 100%;
  }
  .sel-lang-border{
    width: 100%;
    padding: 6% 0 6% 0;
    min-height: 60%;
  }
  .sel-lang-center {
    text-align: center;
  }
  .sel-lang-txt{
    color: #32A4BE;
    text-align: center;
  }
  .sel-lang-button {
    border-radius: 0;
    width: 270px;
    height: 80px;
    color: #32A4BE;
    border-color: #cccccc;
    font-size: 18px;
    margin: 1% 0px;
    text-align:left;
  }
  .sel-lang-button:hover,
  .sel-lang-button:active {
    background-color: #32A4BE;
    color: white;
  }
  .sel-lang-button-disable {
    border-radius: 0;
    width: 270px;
    height: 80px;
    color: #32A4BE;
    border-color: #cccccc;
    font-size: 18px;
    margin: 1% 0px;
    text-align:left;
  }
  .sel-lang-fasize{
    margin: 0px 18px 0px 10px;
    height: 40px;
  }

</style>

<template>
  <div class="compile-page">
    <div class="compile-card">
      
    </div>

    <div class="compile-version">
      <div class="compile-title">{{$t('compile.compilerVersion')}}</div>
      <div class="compiler-content">
        <div>
          <input type="radio" v-model="compilerVersion" value="1">
          <label for="">version 1.0</label>
        </div>
        <div v-if="projectInfo.info.language === 'Python'">
          <input type="radio" v-model="compilerVersion" value="2">
          <label for="">version 2.0
            <a href="https://github.com/ontio/ontology-python-compiler" target="_blank">* New!</a>
          </label>
        </div>
      </div>
      <button class="btn btn-outline-success compile-btn-submit"
              v-bind:disabled="waitingStatus||projectName.info.language===PROJECT_LANGAUGE.ABI"
              @click="doCompile"  data-toggle="tooltip" data-placement="bottom" :title="$t('compile.compileTooltips')">
        <i class="fa fa-play-circle compile-btn-fa"></i>
        {{waitingStatus ? $t('compile.waiting') : $t('compile.compile')}}
      </button>
    </div>

    <div class="compile-card card-abi" v-show="compileInfo.showCompileInfo">
      <div class="card border-secondary mb-3" style="max-width: 20rem;">
        <div class="card-header">
          <div class="row">
            <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10 card-header-text">
              <div data-toggle="tooltip" data-placement="bottom" :title="$t('compile.abiTooltips')">{{$t('compile.abi')}}</div>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
              <div @click="saveAbi"><i class="fa fa-download compile-fa-trash"></i></div>
            </div>
          </div>
        </div>

        <div class="compile-card-scroll">
          <div class="card-body" v-if="compileInfo.abi">
            <div>
              <label><strong>{{$t('compile.hash')}}</strong></label>
              <span>{{ compileInfo.contractHash }}</span>
            </div>

            <div>
              <label><strong>{{$t('compile.entryPoint')}}</strong></label>
              <span>{{ compileInfo.abi.entrypoint }}</span>
            </div>

            <div>
              <label><strong>{{$t('compile.functionList')}}</strong></label>
              <div class="function-list-margin function-code-style">
                <p v-for="abiVal in compileInfo.abi.functions">
                  <span v-if="abiVal.parameters.length === 0">
                    {{ abiVal.name + '( )' }}
                  </span>
                  <span v-else>
                    {{ abiVal.name + '('}}
                    <span v-for="(param, index) in abiVal.parameters">
                      {{ param.type + ' ' + param.name}}
                      <span v-if="index !== abiVal.parameters.length-1">{{', '}}</span>
                    </span>
                    {{ ')' }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="card-body" v-else>
            <p class="card-text">{{$t('compile.noData')}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="compile-card card-output-info" id="mmm" v-show="compileInfo.showCompileInfo">
      <div class="card border-secondary mb-3" style="max-width: 20rem;">
        <div class="card-header">
          <div class="row">
            <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10 card-header-text">
              <div data-toggle="tooltip" data-placement="bottom" :title="$t('compile.nvmTooltips')">{{$t('compile.outputInfo')}}</div>
            </div>
            <div class="row compile-avm-btn-div">
              <div @click="saveAVM"><i class="fa fa-download compile-fa-trash"></i></div>
              <div><button class="nav-link ide-nav-link compile-btn-copy" @click="copyAvm" data-clipboard-target="#compileAvm" ><i class="fa fa-copy compile-fa-trash"></i></button></div>
            </div>
          </div>
        </div>
        <div class="compile-card-scroll">
          <div class="card-body" v-if="compileInfo.avm">
            <!-- <p id="compileAvm" class="card-text">{{compileInfo.avm}}</p> -->
            <textarea name="avm" id="compileAvm" class="card-text" @change="setAvm" :value="compileInfo.avm"></textarea>
          </div>
          <div class="card-body" v-else>
            <!-- <p class="card-text">{{$t('compile.noData')}}</p> -->
            <textarea name="avm" id="compileAvm" class="card-text" @change="setAvm" :value="compileInfo.avm"></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="compile-card card-opcode" v-show="compileInfo.showCompileInfo">
      <div class="card border-secondary mb-3" style="max-width: 20rem;">
        <div class="card-header">
          <div class="row">
            <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10 card-header-text">
              <div>{{$t('compile.opCode')}}</div>
            </div>
            <div class="row compile-avm-btn-div">
              <div @click="saveOpcode"><i class="fa fa-download compile-fa-trash"></i></div>
              <div><button class="nav-link ide-nav-link compile-btn-copy" @click="copyAvm" data-clipboard-target="#compileOpcode" ><i class="fa fa-copy compile-fa-trash"></i></button></div>
            </div>
          </div>
        </div>
        <div class="compile-card-scroll">
          <div class="card-body">
            <textarea name="opcode" id="compileOpcode" class="card-text" :value="compileInfo.opcode"></textarea>
          </div>
        </div>
      </div>
    </div>
    <div class="compile-card" v-show="compileInfo.showCompileInfo">
      <button class="btn btn-outline-success compile-btn-submit" @click="showDeploy">{{$t('compile.next')}}</button>
    </div>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import Clipboard from 'clipboard';
  import FileHelper from "./../../common/ont-wallet/file-generate-and-get";
  import {PROJECT_LANGAUGE} from '../../helpers/consts'

  export default {
    props:["isRecompile"],
    name: "compile",
    data() {
      return {
        waitingStatus: false,
        PROJECT_LANGAUGE,
        compilerVersion: 1
      }
    },
    created(){
    },
    computed: {
      ...mapState({
        projectInfo: state => state.ProjectInfoPage.ProjectInfo,
        projectName: state => state.ProjectInfoPage.ProjectName,
        compileInfo: state => state.CompilePage.CompileInfo,
        editor     : state => state.EditorPage.OntEditor,
      })
    },
    mounted() {
        if (this.projectInfo.info.language === 'Python') {
            this.compilerVersion = 2
          } else {
            this.compilerVersion = this.projectInfo.info.compiler_version || 1
          }
    },
    watch: {
      'isRecompile' : 'isShowCompilePage',
      projectInfo: function(newInfo) {
        console.log(this.projectInfo);
        
        // if (this.projectInfo.info.language === 'Python') {
        //   this.compilerVersion = 2
        // } else {
        //   this.compilerVersion = newInfo.info.compiler_version || 1;
        // }
          this.compilerVersion = newInfo.info.compiler_version || 1;

      }
    },
    methods:{
      isShowCompilePage(){
        this.$router.push({ name:'IDE-Compile',params:{projectName:this.projectName.info.projectName}})
        this.$store.dispatch('setHaveReCompile', false)
      },
      setAvm(e) {
        const avm = e.target.value
        this.$store.dispatch('setAvm', avm)
      },
      doCompile(){
        this.waitingStatus = true
        let code = this.editor.getValue()
        if(!code) {
          //no source code
          this.waitingStatus = false
          return;
        }
        let payload = {
          code : code,
          type : this.projectInfo.info.language,
          compilerVersion: this.compilerVersion
        }
        let _self = this
        // console.log(payload);
        
        this.$store.dispatch('axiosCompile', payload).then(res => {
          _self.waitingStatus = false
          //save code to server

          let param = {
            id: _self.projectName.info.id,
            code: _self.editor.getValue(),
            nvm_byte_code: _self.compileInfo.avm,
            abi: JSON.stringify(_self.compileInfo.abi),
            contract_hash: _self.compileInfo.contractHash,
            compiler_version: parseInt(_self.compilerVersion)
          }
          // console.log(_self.compileInfo)
          this.$store.dispatch('saveProject', param)
          this.$store.dispatch('setHaveReCompile', true)

        })
      },
      showDeploy(){
        this.$router.push({ name:'IDE-Deploy',params:{projectName:this.projectName.info.projectName}})
      },
      copyAvm(){
        let clipboard = new Clipboard('.nav-link');
      },
      saveAbi(){
        let param = {
          contractHash: this.compileInfo.contractHash,
          abi:this.compileInfo.abi
        }
        const ABIName = this.projectName.info.projectName + '.abi.json'
        FileHelper.downloadFile(param,ABIName)
      },
      saveAVM(){
        const AVMName = this.projectName.info.projectName + '.avm'
        FileHelper.downloadFile(this.compileInfo.avm,AVMName)
      },
      saveOpcode(){
        const OpcodeName = this.projectName.info.projectName + '_opcode.txt'
        FileHelper.downloadTextFile(this.compileInfo.opcode, OpcodeName)
      },
    }
  }
</script>

<style scoped>
  .compile-page{
    margin-left: 5px ;
    margin-right: 5px;
    height: 100%;
  }
  .compile-btn-submit {
     border-radius: 0;
     width: 100%;
     color: white;
     border-color: #36a3bc;
     background-color: #36a3bc;
    font-size: 10px;
    padding: 8px 17.6px;
   }
  .compile-btn-submit:hover,
  .compile-btn-submit:active {
    background-color: #36a3bc;
    color: white;
  }
  .compile-btn-copy {
    border-radius: 0;
    border:0px solid #C4C3C3;
    background-color: white;
    height: 20px;
    color: black;
    text-align: center;
    padding: 0 4px 0 4px;
    margin-left: 6px;
  }
  .compile-btn-copy:hover,
  .compile-btn-copy:active {
    border:0px solid #C4C3C3;
    background-color: white;
    color: black;
  }
  .compile-btn-copy:focus{
    background-color: white;
    color: black;
    box-shadow:none !important;
    outline: none !important;
  }

  .compile-btn-fa{
    margin-right: 10px;
  }
  .compile-card{
    margin-top: 5px;
  }

  .function-list-margin {
    margin-left: 15px;
  }
  .function-code-style {
    font-family: Monaco, Menlo, 'Ubuntu Mono', Consolas, source-code-pro, monospace;
  }

  .card{
    max-width: 100% !important;
    height: 100% !important;
    border-radius:0px;
  }
  .card-header{
    background-color: white;
    text-align: center;
    color: #36a3bc;
    padding-top: 6px !important;
    padding-bottom: 6px !important;
  }
  .border-secondary{
    border-color: #C4C3C3 !important;
  }
  .card-text{
    text-align: left;
    width:100%;
    height:200px;
  }
  .card-abi{
    height: 30%;
  }
  .card-output-info{
    height: 25%;
    margin-bottom: -21px;
    padding-bottom: 21px;
  }
  .compile-card-scroll{
    overflow-y:auto;
  }
  .card-opcode{
    height: 25%;
    margin-bottom: -21px;
    padding-bottom: 21px;
  }
  .card-header-text{
    padding-left: 20%;
    padding-top: 2px;
  }
  .compile-fa-trash{
    font-size: 18px;
    margin-top: 4px;
    cursor: pointer;
    color: black;
  }
  .compile-avm-btn-div{
    text-align: right;
    margin-left: 4%;
  }
  .compile-version {
    width: 100%;
    border: 1px solid #C4C3C3;
    background:#ffffff;
  }
  .compile-title {
    text-align: center;
    color: #36a3bc;
    border-bottom: 1px solid rgba(0,0,0,.125);
    padding:.75rem 1.25rem;
  }
  .compiler-content {
    padding:0.75rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    font-size:14px;
  }
  .compiler-content div:first-child {
    margin-right:20px;
  }
</style>

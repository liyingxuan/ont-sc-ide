<template>
  <div class="run-page">

    <!--Basic Info-->
    <div class="run-card card-basic-info" >
      <div class="card border-secondary mb-3" style="max-width: 20rem;">
        <div class="card-header">{{$t('run.basicInfo')}}</div>
        <div class="run-card-scroll">
          <div class="card-body" v-if="contractHash">
            <div>
              <p><strong>{{ $t('run.tradingHash') }}</strong></p>
              <p>{{ contractHash }}</p>
            </div>
          </div>
          <div class="card-body" v-else>
            <p class="card-text">{{$t('compile.noData')}}</p>
          </div>
        </div>
      </div>
    </div>

    <!--Option-->
   <div class="run-card card-Option">
      <div class="card border-secondary mb-3" style="max-width: 20rem;">
        <div class="card-header">{{ $t('run.option') }}</div>
        <div class="run-card-scroll">
          <div class="card-body" v-if="compileInfo.abi">
            <p class="card-text"><strong>{{ $t('run.selectFuc') }}</strong></p>
            <select class="form-control run-card-select" v-model="optionId" @change="getParameter(optionId)">
              <option disabled selected >{{$t('run.selectFucOption')}}</option>
              <option v-for="(abiVal,index) in compileInfo.abi.functions" :key="index"
                      :value="abiVal.name"
                      v-if="abiVal.name !== 'Main'">
                {{abiVal.name }}
              </option>
            </select>
            <br/>
            <div v-for="(parameter) of this.parameters">
                <sc-parameter :parameter="parameter"  :key="parameter.name"></sc-parameter>
            </div>
          </div>
          <div class="card-body" v-else>
            <p class="card-text">{{$t('compile.noData')}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="run-card run-btns">
      <button class="btn btn-outline-success run-btn-submit" 
              v-bind:disabled="runStatus" @click="debugContract()">{{runStatus&&runDebug ? $t('run.waiting') : $t('run.debugRun')}}</button>
      <button class="btn btn-outline-success run-btn-submit"
              id="preRun" data-toggle="tooltip" data-placement="top" :title="$t('run.preRuntips')"
              v-bind:disabled="runStatus" @click="runContract(true)">{{runStatus&&runPreRun ? $t('run.waiting') : $t('run.preRun')}}</button>
      <button class="btn btn-outline-success run-btn-submit" 
               v-bind:disabled="runStatus" @click="runContract(false)">{{runStatus&&runOnly ? $t('run.waiting') : $t('run.run')}}</button>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import zh from './../../common/lang/zh'
  import en from './../../common/lang/en'
  import LangStorage from './../../helpers/lang'
  import {PROJECT_LANGAUGE} from '../../helpers/consts'
  import * as types from './../../store/mutation-type'
  import { OP_TYPE } from './../../helpers/consts';
  import ScParameter from '../common/ScParameter'
  import * as ParamsHelper from './../../helpers/params'
  let Ont = require('ontology-ts-sdk');
  let Debugger = require('ontology-ts-debugger').Debugger;

  function validateRun(self) {
    if(!self.functionName) {
      self.ErrorInfo = (LangStorage.getLang('zh') === "zh") ? zh.run.errorFunction : en.run.errorFunction
      $('#RunError').modal('show')
      self.$store.commit({
        type : types.SET_RUN_STATUS,
        running : false
      })
      return false;
    }
    //validate and format parameters
    const parameters = self.functionParameters.slice();
    for(let p of parameters) {
      if(p.name && !p.value) {
        alert('Parameter '+ p.name + ' is required.')
        self.$store.commit({
          type : types.SET_RUN_STATUS,
          running : false
        })
        return false;
      }
      if(p.type === 'ByteArray' && p.value.length%2 !== 0) {
        alert('Parameter ' + p.name + ' is not valid hex string.')
        self.runStatus = false;
        return;
      }
      if(p.type === 'Integer') {
        p.value = parseInt(p.value)
      }
    }

    return true;
  }

  export default {
    name: "run",
    data() {
      return {
        optionId: '',
        functionName : '',
        functionParameters : {},
        parameters: [],
        ErrorInfo: '',
        runStatus: false,
        runDebug:false,
        runPreRun:false,
        runOnly:false,
        contractHash:''
      }
    },
    created(){
    },
    components: {
      ScParameter
    },
    computed: {
      ...mapState({
        projectInfo: state => state.ProjectInfoPage.ProjectInfo,
        ProjectName: state => state.ProjectInfoPage.ProjectName,
        compileInfo: state => state.CompilePage.CompileInfo,
        runInfo : state => state.RunPage.RunInfo,
        projectEditor: state => state.EditorPage.OntEditor,
        store : state => state.EditorPage.Store
      })
    },
    mounted(){
      if(this.compileInfo.abi && this.compileInfo.abi.functions.length > 0) {
        for(let f of this.compileInfo.abi.functions) {
          this.functionParameters[f.name] = f.parameters.map((p)=> new Ont.Parameter(p.name, p.type, {}))
        }
      }
      this.contractHash = this.compileInfo.contractHash;
    },
    watch: {
      runInfo : function(newInfo, oldInfo) {
        this.optionId = ''
        this.functionName = ''
        // this.functionParameters = {}
      },
      compileInfo: function(newInfo, oldInfo) {
        for(let f of newInfo.abi.functions) {
          this.functionParameters[f.name] = f.parameters.map((p)=> new Ont.Parameter(p.name, p.type, {}))
        }
        if(newInfo.contractHash) {
          this.contractHash = newInfo.contractHash
        }
      },
    },
    methods: {
      getParameter($optionId){
        this.parameters = this.functionParameters[$optionId]
        this.functionName = $optionId
        // let funcObj = this.compileInfo.abi.functions[$optionId]
        // this.functionName = funcObj.name
        // let params = []
        // for(let p of funcObj.parameters) {
        //   if(p.name) {
        //     let o = new Ont.Parameter(p.name, p.type, '')
        //     o.typeTip = this.getParameterTypeTip(p.type)
        //     console.log(o)
        //     params.push(o)
        //   }
        // }
        // this.functionParameters = params
      },
      changeParameterTypeTip(parameter) {
        parameter.typeTip = this.getParameterTypeTip(parameter.type)
        if(parameter.type !== 'Boolean') {
          console.log(parameter)
          parameter.value = '';
        }
      },
      getParameterTypeTip(type) {
        let typeTip = ''
        switch (type) {
          case 'ByteArray':
            typeTip = 'Enter hex string';
            break;
          case 'String' :
            typeTip = 'Enter string';
            break;
          case 'Integer' :
            typeTip = 'Enter integer';
            break;
          case 'Boolean' :
            typeTip = 'Enter bool';
            break;
          default : {
          }
        }
        return typeTip;
      },
      debugContract: async function() {
        let errorTitle = (LangStorage.getLang('zh') === "zh") ? zh.run.errorTitle : en.run.errorTitle

        if(!this.functionName) {
          this.ErrorInfo = (LangStorage.getLang('zh') === "zh") ? zh.run.errorFunction : en.run.errorFunction
          this.showLoadingModal(errorTitle,this.ErrorInfo,true)
          this.$store.commit({
            type : types.SET_RUN_STATUS,
            running : false
          })
          return;
        }
        
        let codeLang = this.ProjectName.info.language
        if(codeLang === PROJECT_LANGAUGE.PYTHON){
          this.runStatus = true;
          this.runDebug = true

          // let args = Ont.ScriptBuilder.buildSmartContractParam(this.functionName, this.functionParameters);
          const parameters = ParamsHelper.formatAndValidateParameters(this.parameters);
          if(!parameters) {
            this.runStatus = false;
            return;
          }
          const abiFunc = new Ont.AbiFunction(this.functionName, '', parameters);
          const args = Ont.ScriptBuilder.serializeAbiFunction(abiFunc);

          let avm = new Buffer(this.compileInfo.avm, 'hex');
          let lineMappings = {};
          let lineToMethod = {};
          if(!this.compileInfo.debug){
            this.runStatus = false;
            this.runDebug = false
            alert('No debug info. Please compile the smart contract first. ')
            return;
          }
          let debugMap = this.compileInfo.debug.map;
          debugMap.forEach((m) => {
            lineMappings[m.file_line_no] = {start: m.start, end: m.end};
            lineToMethod[m.file_line_no] = m.method;
          });

          let funcMap = {};
          this.compileInfo.funcmap.Functions.forEach((f) => {
            funcMap[f.Method] = f.VarMap;
          });

          let self = this;
          let debug = new Debugger(avm, lineMappings, (payload) => {
            console.log(payload);
            let line;
            let locals;
            let method;
            if (payload.line !== undefined) {
              line = payload.line - 1;
              let selection = self.projectEditor.selection;
              self.projectEditor.gotoLine(payload.line, 0);
              self.projectEditor.navigateLineStart();
              let session = self.projectEditor.getSession();
              session.addGutterDecoration(payload.line - 1, 'ace_breakpoint_active');

              if (payload.altStack.count() > 0) {
                let stack = payload.altStack.peek(0).getArray();
                method = lineToMethod[line + 1];
                if (method != null) {
                  let map = funcMap[method];
                  if (map != null) {
                    locals = [];
                    Object.entries(map).forEach((k, v) => {
                      locals.push({
                        name: k[0],
                        value: stack[v]
                      });
                    });
                  }
                }
              }
            }
            let evaluationStack = [];
            for (let i = 0; i < payload.evaluationStack.count(); i++) {
              evaluationStack.push(payload.evaluationStack.peek(i));
            }
            let altStack = [];
            for (let i = 0; i < payload.altStack.count(); i++) {
              if (method != null && i === 0) {
                altStack.push([method, payload.altStack.peek(i)]);
              } else {
                altStack.push([null, payload.altStack.peek(i)]);
              }
            }
            let history = payload.history.slice().reverse();
            this.$store.commit({
              type: types.SET_DEBUGGER_STATE,
              line,
              evaluationStack,
              altStack,
              history,
              locals
            });
          }, this.store, (notification) => {
            this.$store.commit({
              type: types.APPEND_OUTPUT_LOG,
              log: notification.states,
              op: OP_TYPE.Notify
            });

            console.log(OP_TYPE.Notify)
          }, (log) => {
            this.$store.commit({
              type: types.APPEND_OUTPUT_LOG,
              log: log.message,
              op: OP_TYPE.Log
            });
          });

          this.$store.commit({
            type: types.SET_DEBUGGER,
            debug
          });

          let breakpoints = this.projectEditor.getSession().getBreakpoints();
          for (let [i, value] of breakpoints.entries()) {
            if (value !== undefined) {
              debug.addLineBreakpoint(i + 1);
            }
          }

          try {
            let { result, notifications, logs } = await debug.execute([new Buffer(args, 'hex')]);

            let formattedResult = result.toString();

            this.$store.commit({
              type: types.APPEND_OUTPUT_LOG,
              log: formattedResult,
              op: OP_TYPE.Invoke
            });
          } catch (e) {
            this.$store.commit({
              type: types.APPEND_OUTPUT_LOG,
              log: e.toString(),
              op: OP_TYPE.Error
            });
          }

          this.$store.commit({
            type: types.SET_DEBUGGER
          });
          this.$store.commit({
            type: types.SET_DEBUGGER_STATE
          });

          this.runStatus = false;
          this.runDebug = false
        }else{
          let title = (LangStorage.getLang('zh') === "zh") ? zh.run.comingSoonTitle : en.run.comingSoonTitle
          let error = (LangStorage.getLang('zh') === "zh") ? zh.run.comingSoon : en.run.comingSoon
          this.runStatus = false;
          this.runDebug = false
          this.showLoadingModal(title,error,true)
        }
      },
      runContract(preExec) {
        this.runStaus = true;
        if(preExec){
          this.runPreRun = true
        }else{
          this.runOnly = true
        }
        let errorTitle = (LangStorage.getLang('zh') === "zh") ? zh.run.errorTitle : en.run.errorTitle

        if(!this.functionName) {
          this.ErrorInfo = (LangStorage.getLang('zh') === "zh") ? zh.run.errorFunction : en.run.errorFunction
          this.showLoadingModal(errorTitle,this.ErrorInfo,true)
          this.$store.commit({
            type : types.SET_RUN_STATUS,
            running : false
          })
          return;
        }
        if(!this.contractHash) {
          this.ErrorInfo = (LangStorage.getLang('zh') === "zh") ? zh.run.noContractHash : en.run.noContractHash
          this.showLoadingModal(errorTitle,this.ErrorInfo,true)
          this.$store.commit({
            type : types.SET_RUN_STATUS,
            running : false 
          })
          return;
        }
        //validate and format parameters
        const parameters = ParamsHelper.formatAndValidateParameters(this.parameters);
        if(!parameters) {
          this.runStatus = false;
          return;
        }

        let contractHash = this.contractHash

        const params = {  
          contract: contractHash,
          method: this.functionName,
          parameters: parameters,
          gasPrice: 500,
          gasLimit: 200000,
          requireIdentity: false
        }
        this.$store.dispatch('getDapiProvider').then(provider => {
          if(!provider) {
            alert(this.$t('ide.noProvider'))
            this.runStatus = false;
            return;
          }
          if(preExec) {
            this.$store.dispatch('dapiInvokeRead', params).then(res => {
              console.log(res);
              this.runStatus = false;
              this.runPreRun = false
              return;
            })
          } else {
            this.$store.dispatch('dapiInvoke', params).then(res => {
              console.log(res)
              this.runStatus = false
              this.runOnly = false
              if(res === 'NO_ACCOUNT') {
                alert(this.$t('ide.noProviderAccount'));
                return;
              }
            })            
          }
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
    }
  }
</script>

<style scoped>
  .run-page{
    margin-left: 5px ;
    margin-right: 5px;
    height: 100%;
    display:flex;
    flex-direction: column;
  }
  .run-btn-submit {
    border-radius: 0;
    width: 100%;
    color: white;
    border-color: #36a3bc;
    background-color: #36a3bc;
    font-size: 10px;
    padding: 8px 17.6px;
    margin-bottom:15px;
  }
  .run-btn-submit:hover,
  .run-btn-submit:active {
    background-color: #18bae2;
    color: white;
  }
  .run-card{
    margin-top: 5px;
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
  .card-text{
    margin-bottom: 2px;
  }
  .border-secondary{
    border-color: #C4C3C3 !important;
  }
  .card-basic-info{
    height: 30%;
  }
  .card-Option{
    flex:1;
    margin-bottom: -26px;
    padding-bottom: 26px;
  }
  .run-card-select{
    margin-top: 5px;
    line-height:1;
    padding:0px 50px 0px 10px;
  }
  .run-input-and-txt{
    display: flex;
    flex-wrap: wrap;
    margin-top: 8px;
  }
  .run-input{
    width: 50%;
    height: 24px;
    margin-left: 16px;
  }
  .run-card{
    margin-top: 5px;
  }
  .run-card-scroll{
    overflow-y:auto;
  }
  .run-modal{
    margin-top: 10%;
  }
  .run-dialog-btn-close{
    border-radius:0px;
  }
  .error-modal-body-text{
    font-size: 16px;
  }
  .run-input-radio {
    margin-left: 16px;
  }
 .run-btns {
     display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* position: absolute;
    bottom: 0;
    left: 0; */
    width: 100%;
}

.run-btns button {
  width:30%;
  margin-bottom:10px;
}
</style>

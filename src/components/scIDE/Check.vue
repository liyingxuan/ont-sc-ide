<template>
  <div class="_check_page">
    <div class="_socket_box">
      <div class="_socket_desp">{{$t('compile.desp')}}
        <br/>
        <a href="https://github.com/ontio/ontology-python-compiler/tree/master/vaas" target="_blank">{{$t('compile.featuresLink')}}</a>
      </div>
      <button
        class="btn btn-outline-success compile-btn-submit"
        data-toggle="tooltip"
        data-placement="bottom"
        :title="$t('compile.compileTooltips')"
        @click="socketCompile"
        :disabled="isDisable"
      >
        <i class="fa fa-play-circle compile-btn-fa"></i>
        <!-- socket编译 -->
        {{waitingStatus ? $t('compile.checking') : $t('compile.socket_compile')}}
      </button>
      <div class="_text_area" v-if="resultInfo2.length != 0">
        <!-- <textarea v-model="checkInfo"></textarea> -->
        <div class="state_list" v-for="(item, index) in resultInfo2">
          <p>
            <i>Title:</i>
            {{item.title}}
          </p>
          <p>
            <i>Type:</i>
            <span class="state_code_err" v-if="item.type == 'Error'">{{item.type}}</span>
            <span class="state_code_waring" v-else-if="item.type == 'Warning'">{{item.type}}</span>
            <span class="state_code_success" v-else>{{item.type}}</span>
          </p>
          <p>
            <i>Line:</i>
            {{item.line}};
            <i>col:</i>
            {{item.col}}:{{item.msg | deleteFile}}
          </p>
          <!-- <p> -->
            <!-- <i>Msg:</i> -->
            <!-- {{item.msg | deleteFile}} -->
          <!-- </p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      waitingStatus: false,
      compilerVersion: 2,
      checkInfo: '',
      isDisable: false,
      resultInfo: ''
    };
  },
  computed: {
    ...mapState({
      projectInfo: state => state.ProjectInfoPage.ProjectInfo,
      projectName: state => state.ProjectInfoPage.ProjectName,
      compileInfo: state => state.CompilePage.CompileInfo,
      editor: state => state.EditorPage.OntEditor
    }),
    resultInfo2() {
      let arr = []
      for (const key in this.resultInfo) {
        if (this.resultInfo.hasOwnProperty(key)) {
          arr = this.resultInfo[key];
        }
      }
      return arr
    }
  },
  methods: {
    socketCompile() {
      this.checkInfo = '';
      this.resultInfo = '';
      this.waitingStatus = true;
      this.isDisable = true;
      let code = this.editor.getValue();
      if (!code) {
        //no source code
        this.waitingStatus = false;
        return;
      }
 
      this.socketConnect(
        "wss://vaas.ont.io/api/v2.0/python/vaas",
        code,
        res => {
          this.waitingStatus = false;
          this.isDisable = false;
          if (res.errcode == 0) {
            this.checkInfo = res.result
            this.resultInfo = JSON.parse(res.result)
          }
        }
      );
    },
    socketConnect(url, data, callback) {
      let ws = new WebSocket(url);
      ws.onopen = e => {
        // console.log("连接成功", e);
        ws.send(data);
        ws.onmessage = e => {
        callback && callback(JSON.parse(e.data))
        // do something
        ws.close()
        
      };

      ws.onclose = e => {
          this.waitingStatus = false;
          this.isDisable = false;
        }
      };
      
      return ws;
    }
  },
  filters: {
    deleteFile(str) {
      if (!str) return ''
      let f = str.indexOf('File:')
      let p = str.indexOf('.py')
      if (f >= 0 && p > 0) {
        let s1 = str.substr(0, f)
        let s2 = str.substr((p + 5), str.length)
        let ns = s1 + s2
        return ns
      } else {
        return str
      }
    }
  }
};
</script>

<style scoped>
._check_page {
  margin-left: 5px;
  margin-right: 5px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
._socket_box {
  margin-top: 10px;
  background: #fff;
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

._socket_desp {
  padding: 10px;
  text-indent: 1em;
  height: 100px;
  overflow-y: auto;
  margin-bottom: 10px;
}

._text_area {
  padding: 1.25rem;
  -webkit-box-flex: 1;
  flex: 1 1 auto;
  height: 100%;
  overflow-y: auto;
}
textarea {
  width: 100%;
  height: 400px;
  resize: none;
}
._text_area .state_list {
  border: 1px solid #ccc;
  padding: 0 6px;
  margin-bottom: 10px;
}
._text_area .state_list p {
  margin-bottom: 0;
  padding-bottom: 0;
  /* color: #33c; */
}
._text_area .state_list p i {
  color: #33c;
}
._text_area .state_list p .state_code_err {
  color: #f56c6c;
}
._text_area .state_list p .state_code_waring {
  color: #e6a23c;
}

._text_area .state_list p .state_code_success {
  color: #67c23a;
}
</style>

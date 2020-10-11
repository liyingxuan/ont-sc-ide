import Vue from 'vue'
import Vuex from 'vuex'

import BlockChain from './modules/block-chain'
import LoginPage from './modules/login'
import RegisterPage from './modules/register'
import ProjectListPage from './modules/project-list'
import ProjectInfoPage from './modules/project-info'
import DeployPage from './modules/deploy'
import RunPage from './modules/run'
import CompilePage from './modules/compile'
import ProjectOutput from './modules/project-out'
import EditorPage from './modules/editor'
import ProjectEditor from './modules/project-editor'
import LoginGithub from './modules/login-github'
import LoadingModalPage from './modules/LoadingModal'
import TestPage from './modules/test'
import CommonModal from './modules/CommonModal'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    BlockChain,
    LoginPage,
    RegisterPage,
    ProjectListPage,
    ProjectInfoPage,
    DeployPage,
    RunPage,
    CompilePage,
    ProjectOutput,
    EditorPage,
    ProjectEditor,
    LoginGithub,
    LoadingModalPage,
    TestPage,
    CommonModal
  }
})

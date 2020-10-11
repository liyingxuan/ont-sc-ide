import Vue from 'vue'
import Router from 'vue-router'
import Store from '../store/index'
import Cookies from 'vue-cookies'

import Help from '@/components/common/Help'
import About from '@/components/common/About'
import Register from '@/components/register/Register'
import RegisterSuccess from '@/components/register/RegisterSuccess'
import RegisterSuccessPrivateKey from '@/components/register/RegisterSuccessPrivateKey'
import Recovery from '@/components/register/Recovery'
import Login from '@/components/login/Login'
import ProjectList from '@/components/scProject/ProjectList'
import CreateProject from '@/components/scProject/CreateProject'
import SelectLanguage from '@/components/scProject/SelectLanguage'
import OpenAbiFile from '@/components/scProject/OpenAbiFile'
import IDE from '@/components/scIDE/IDE'
import Compile from '@/components/scIDE/Compile'
import Check from '@/components/scIDE/Check'
import Deploy from '@/components/scIDE/Deploy'
import Run from '@/components/scIDE/Run'
import Tool from '@/components/scIDE/Tool'
import Test from '@/components/scIDE/Test'
import Restful from '@/components/scIDE/Restful'
import LoginGithub from '@/components/login/LoginGithub'
import Setting from '@/components/setting/Setting'
import SettingOntId from '@/components/setting/SettingOntid'
import SettingGithub from '@/components/setting/SettingGithub'

import PARAM from "../../config/prod.env"

Vue.use(Router)
let routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {requiresGuest: true}
  },
  {
    path: '/help',
    name: 'Help',
    component: Help,
    meta: {}
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {}
  },
  {
    path: '/LoginGithub',
    name: 'LoginGithub',
    component: LoginGithub,
    meta: {requiresGuest: true}
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {requiresGuest: true}
  },
  {
    path: '/registerSuccess',
    name: 'RegisterSuccess',
    component: RegisterSuccess,
    meta: { requiresRegister: true }
  },
  {
    path: '/registerSuccessPrivateKey',
    name: 'RegisterSuccessPrivateKey',
    component: RegisterSuccessPrivateKey,
    meta: { requiresRegister: true }
  },
  {
    path: '/recovery',
    name: 'Recovery',
    component: Recovery,
    meta: {requiresGuest: true}
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {requiresGuest: true}
  },
  {
    path: '/project-list',
    name: 'ProjectList',
    component: ProjectList,
    meta: {requiresAuth: true}
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
    meta: {requiresAuth: true},
    children:[
      {path: '/setting/ontid',name:'SettingOntId',component:SettingOntId,meta: {requiresAuth: true}},
      {path: '/setting/github',name:'SettingGithub',component:SettingGithub,meta: {requiresAuth: true}},
    ]
  },
  {
    path: '/create-project',
    name: 'CreateProject',
    component: CreateProject,
    meta: {requiresAuth: true}
  },
  {
    path: '/open-abi-file',
    name: 'OpenAbiFile',
    component: OpenAbiFile,
    meta: {requiresAuth: true}
  },
  {
    path: '/create-project-wasm',
    name: 'CreateProjectWASM',
    component: CreateProject,
    meta: {requiresAuth: true}
  },
  {
    path: '/select-language',
    name: 'SelectLanguage',
    component: SelectLanguage,
    meta: {requiresAuth: true}
  },
  {
    path: '/select-language-wasm',
    name: 'SelectLanguageWASM',
    component: SelectLanguage,
    meta: {requiresAuth: true}
  },

  {
    path: '/ide-compile/:projectName',
    name: 'IDE',
    component: IDE,
    meta: {requiresAuth: true},
    children:[
      {path: '/ide-compile/:projectName',name:'IDE-Compile',component:IDE-Compile,meta: {requiresAuth: true}},
      {path: '/ide-check/:projectName',name:'IDE-Check',component:IDE-Check,meta: {requiresAuth: true}},
      {path: '/ide-deploy/:projectName',name:'IDE-Deploy',component:IDE-Deploy,meta: {requiresAuth: true}},
      {path: '/ide-run/:projectName',name:'IDE-Run',component:IDE-Run,meta: {requiresAuth: true}},
      {path: '/ide-tool/:projectName',name:'IDE-Tool',component:IDE-Tool,meta: {requiresAuth: true}},
      {path: '/ide-test/:projectName',name:'IDE-Test',component:IDE-Test,meta: {requiresAuth: true}},
      {path: '/ide-restful/:projectName',name:'IDE-Restful',component:IDE-Restful,meta: {requiresAuth: true}}
    ]
  },
]

const router = new Router({
  routes: routes
})

router.beforeEach((to,from , next)=> {
  // If not login,can't visit
  if (to.meta.requiresAuth && !Store.state.LoginPage.OntIdProjectInfo.authenticated) {
    if(!Cookies.isKey("version")||Cookies.get("version")!== PARAM.VERSION ){
      Cookies.remove("token")
      Cookies.remove("auth_id")
      Cookies.remove("version")
      return next({'name': 'Login'})
    }else{
      if(Cookies.isKey("token") && Cookies.isKey("auth_id")){
        //If there are informations of ontId in cookies.
        // 如果Cookies中存有token和id认证的信息
        let info = {
          token: Cookies.get("token"),
          auth_id: Cookies.get("auth_id"),
        }
        Store.dispatch('setOntIdProjectInfo', info)
        if(Cookies.isKey("projectName") && Cookies.isKey("projectLanguage") && Cookies.isKey("projectID")){
          let payload = {
            projectName : Cookies.get("projectName"),
            language : Cookies.get("projectLanguage"),
            id: Cookies.get("projectID"),
          }
          Store.dispatch('setProjectName',payload)
          return next({'name': to.name , params:{projectName:payload.projectName,isCreateProject:false}})
        }else if(Cookies.isKey("projectLanguage") ){
          if($.isEmptyObject(Store.state.ProjectListPage.ProjectList.info)){
            return next({'name': 'ProjectList'})
          }else{
            return next({'name': to.name , params:{projectName:Cookies.get("projectLanguage")}})
          }
        } else{
          return next({'name': to.name})
        }
      }else{
        return next({'name': 'Login'})
      }
    }
  }
  // If not register and recover success ,can't visit
  if (to.meta.requiresRegister && !Store.state.RegisterPage.Register.authenticated) {
    return next({'name': 'Login'})
  }

    next()
})

export default router

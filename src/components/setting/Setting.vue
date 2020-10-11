<template>
  <div class="container-fluid">
    <div class="row justify-content-center sc-setting-border">
      <div class="col-lg-9 col-md-9 col-sm-10 col-xs-12 row" >
        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
          <div class="list-group" id="list-tab" role="tablist">
            <a class="list-group-item list-group-item-action disabled sc-list-top"  data-toggle="list" role="tab" aria-controls="setting">{{ $t('setting.title')}}</a>
            <a class="list-group-item list-group-item-action sc-setting-list-group-item" :class="[isShowOntid ? 'active':'']" id="list-ontId-list" data-toggle="list" @click="toSettingOntId" role="tab" aria-controls="home">{{ $t('setting.ontid')}}</a>
            <a class="list-group-item list-group-item-action sc-setting-list-group-item" :class="[isShowGithub ? 'active':'']" id="list-github-list" data-toggle="list" @click="toSettingGithub" role="tab" aria-controls="profile">{{ $t('setting.github')}}</a>
          </div>
        </div>
        <div class="col-lg-9 col-md-9 col-sm-9 col-xs-12">
          <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="list-ontId" role="tabpanel" aria-labelledby="list-ontId-list">
              <div v-show="isShowOntid">
                <setting-ontid></setting-ontid>
              </div>
              <div v-show="isShowGithub">
                <setting-github></setting-github>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import SettingOntid from './SettingOntid'
  import SettingGithub from './SettingGithub'

  export default {
    name: "setting",
    data() {
      return {
        isShowOntid: true,
        isShowGithub: false,
      }
    },
    created(){
      this.showTopNavGreen()
      this.getPage();
    },
    components: {
      SettingOntid,
      SettingGithub,
    },
    watch: {
      '$route': 'getPage',
    },
    methods:{
      showTopNavGreen(){
        this.$emit('isShowTopNav',false) //Show the white topnav or not //是否显示白色的topnav
      },
      getPage(){
        if(this.$route.name === 'SettingOntId'){
          this.showSettingOntId()
        }else if(this.$route.name === 'SettingGithub'){
          this.showSettingGithub()
        }
      },
      showSettingOntId(){
        this.isShowOntid = true
        this.isShowGithub = false
      },
      showSettingGithub(){
        this.isShowOntid = false
        this.isShowGithub = true
      },
      toSettingOntId(){
        this.$router.push({ name: 'SettingOntId'})
      },
      toSettingGithub(){
        this.$router.push({ name: 'SettingGithub'})
      },
    }
  }
</script>

<style scoped>
  .sc-setting-border{
    /*border:1px solid #C4C3C3;*/
    margin: 5% 0 8% 0;
    width: 100%;
  }
  .list-group-item.active,
  .list-group-item.active:hover,
  .list-group-item.active:focus {
    z-index: 2;
    color: #fff;
    background-color: #32A4BE;
    border-color: #17a2b8;
  }
  .list-group-item.disabled,
  .list-group-item.disabled:hover,
  .list-group-item.disabled:focus {
    color: #586069;
    background-color: #f3f5f8;
  }
  .sc-list-top{
    height: 54px;
    font-size: 16px;
    padding: 14px 20px 14px 20px;
  }
  .sc-setting-list-group-item{
    cursor: pointer;
  }

</style>

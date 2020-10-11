<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-10 col-sm-10 col-xs-12">
        <div>
          <h2 class="about-title about-center"> {{ $t('about.title') }}</h2>
        </div>

        <div class="about-content">
          <p class="mb-0">{{ $t('about.content1') }}</p>
        </div>

        <div class="about-content">
          <p class="mb-0">{{ $t('about.content2') }}</p>
        </div>

        <div class="about-content">
          <p class="mb-0">{{ $t('about.content3') }}</p>
        </div>

        <div class="about-content">
          <p class="mb-0">{{ $t('about.content4') }}</p>
        </div>


      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: "help",
    created(){
      this.showTopNavGreen()
    },
    methods:{
      showTopNavGreen(){
        this.$emit('isShowTopNav',false) //Show the white topnav or not //是否显示白色的topnav
    },
    }
  }
</script>

<style scoped>
  .about-center{
    text-align:center;
  }
  .about-right{
    text-align:right;
  }
  .about-title{
    margin-top: 50px;
    margin-bottom: 20px;
    font-weight: 300;
  }
  .about-content{
    margin-top: 20px;
    margin-bottom: 15px;
  }
  .about-image-content{
    height: 450px;
    text-align: center;
  }
  .about-marge{
    margin-top: 15px;
    margin-bottom: 20px;
  }
  .about-content-last{
    margin-bottom: 50px;
  }
</style>

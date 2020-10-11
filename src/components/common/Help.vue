<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-10 col-sm-10 col-xs-12">
        <div>
          <h1 class="help-title help-center"> Ont Smart Contract IDE</h1>
        </div>

        <div class="help-content">
          <p class="h3">Introduction</p>
          <p class="mb-0">It is a open source and user friendly online editor for Ontology contract IDE. It supports three popular programme languages for now, and will supports more in the future. Users can easily compile ,deploy and invoke their contracts with it.</p>
          <div class="help-center help-marge">
            <img class="img-thumbnail help-image-content" src="./../../assets/help/index.png"/>
          </div>
        </div>

        <div class="help-content">
          <p class="h3">Sign Up</p>
          <p class="mb-0">First you should create a ONTID to manage your smart contract project.Click the "Sign Up" button in the home page to enter the registration page,as figure shows.</p>
          <div class="help-center help-marge">
            <img class="img-thumbnail help-image-content" src="./../../assets/help/sign-up.png"/>
          </div>
          <p class="mb-0">After entering the password twice(the password length requirement greater than 6),click the "Create a New ONT ID" button to sign in successfully,as figure shows.You need to click the "Download" button to download the ONTID file and back up the private key.The ONTID file stores your encrypted ONTID and private key ,and the private key is the only credential for you to recover the ONTID account and must be properly kept.</p>
          <div class="help-center help-marge">
            <img class="img-thumbnail help-image-content" src="./../../assets/help/sign-up-success.png"/>
          </div>
          <p class="mb-0">If you already have the ONTID, you can click the "Recovery your ONT ID" button to recover the ONTID file. as the picture shows. After entering the private key and two passwords, click the "Recovery Your ONTID" button to register successfully.</p>
          <div class="help-center help-marge">
            <img class="img-thumbnail help-image-content" src="./../../assets/help/recovery.png"/>
          </div>
        </div>

        <div class="help-content">
          <p class="h3">Sign In</p>
          <p class="mb-0">After registration, you already have the ONTID file. You just need to select this file and enter the password to sign in and get the project list as shown in the figure.</p>
          <div class="help-center help-marge">
            <img class="img-thumbnail help-image-content" src="./../../assets/help/login.png"/>
          </div>
          <p class="mb-0">After signed in, you will enter the project list page. You can choose to open an existing smart contract project or create a new one.</p>
          <div class="help-center help-marge">
            <img class="img-thumbnail help-image-content" src="./../../assets/help/project-list.png"/>
          </div>
        </div>

        <div class="help-content">
          <p class="h3">Create Project</p>
          <p class="mb-0">You can click on the "Create Project" button to start creating a new smart contract project.</p>
          <p class="mb-0">First you should choose the language to write your smart contract，as shown in the figure.The languages currently supported are: C#,Python and JavaScript.</p>
          <div class="help-center help-marge">
            <img class="img-thumbnail help-image-content" src="./../../assets/help/select-language.png"/>
          </div>
          <p class="mb-0">After that you need to select a project template and enter the project name, then click the "OK" button to generate the project.</p>
          <div class="help-center help-marge">
            <img class="img-thumbnail help-image-content" src="./../../assets/help/create-project.png"/>
          </div>
        </div>

        <div class="help-content">
          <p class="h3">Editor</p>
          <p class="mb-0">You can see the main editor page.</p>
          <p class="mb-0">The left side is the editor and the logs output box.</p>
          <p class="mb-0">The right side is the operation panel.</p>
          <div class="help-center help-marge">
            <img class="img-thumbnail help-image-content" src="./../../assets/help/ide.png"/>
          </div>
          <p class="mb-0">You can enjoy coding your smart contracts now.We also provide hotkeys ,you can use CTRL+ALT+H to access the hotkeys information list.</p>
          <p class="mb-0">You can also import existing code files. Click the "open file" option in the "File" button to import the code into ide.</p>
        </div>

        <div class="help-content">
          <p class="h3">Compile Smart Contract</p>
          <p class="mb-0">After you have written your smart contract, you can click the Compile button on the right side to compile your code.</p>
          <p class="mb-0">If your code is correct, your smart contract will be compiled to the ABI and AVM file , and display on the right side,as figure shows. </p>
          <div class="help-center help-marge">
            <img class="img-thumbnail help-image-content" src="./../../assets/help/compile.png"/>
          </div>
        </div>

        <div class="help-content">
          <p class="h3">Deploy Smart Contract</p>
          <p class="mb-0">Next, you can deploy the smart contract to the blockchain. This step costs a fee, so you have to select one of your local wallets with enough balance. Then click the Deploy button to deploy the contract.</p>
          <p class="mb-0">Besides IDE, you can use ONT SDK to deploy the smart contract. Please check the SDKs for more detailed information.</p>
          <div class="help-center help-marge">
            <img class="img-thumbnail help-image-content" src="./../../assets/help/deploy.png"/>
          </div>
        </div>

        <div class="help-content help-content-last">
          <p class="h3">Invoke Smart Contract</p>
          <p class="mb-0">Last, you can run the method of your contract. This step costs a fee too. You can select the method and input the params to invoke. The result will display on the right side.</p>
          <div class="help-center help-marge">
            <img class="img-thumbnail help-image-content" src="./../../assets/help/run.png"/>
          </div>
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
  .help-center{
    text-align:center;
  }
  .help-title{
    margin-top: 50px;
    margin-bottom: 20px;
    font-weight: 300;
  }
  .help-content{
    margin-top: 30px;
    margin-bottom: 20px;
  }
  .help-image-content{
    height: 450px;
    text-align: center;
  }
  .help-marge{
    margin-top: 15px;
    margin-bottom: 20px;
  }
  .help-content-last{
    margin-bottom: 50px;
  }
</style>

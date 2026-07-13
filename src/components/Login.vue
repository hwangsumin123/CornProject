<template>

<div class="login-page">


    <!-- 로고 영역 -->
    <div class="logo-area">

        <div class="corn-logo">
            🌽
        </div>

        <h1>
            Task Manager
        </h1>


    </div>



    <!-- 카드 영역 -->
    <div class="card-container">


        <!-- 팀 만들기 카드 -->
        <div class="login-card">

            <h2>
                🌱 팀 만들기
            </h2>

            <p>
                새로운 팀을 생성합니다.
            </p>


            <input
            v-model="createTeamName"
            placeholder="팀 이름"
            />


            <button @click="createTeam">

                팀 생성

            </button>


        </div>




        <!-- 팀 입장 카드 -->
        <div class="login-card">


            <h2>
                👥 팀 참여
            </h2>

            <p>
                팀 ID로 참여합니다.
            </p>


            <input
            v-model="joinTeamId"
            placeholder="팀 ID"
            />


            <input
            v-model="nicknameInput"
            placeholder="닉네임"
            />


            <button @click="joinTeam">

                입장

            </button>


        </div>


    </div>


</div>

</template>



<script>

export default {


data(){

    return{

        // 팀 이름 입력값
        createTeamName:"",

        // 팀 ID 입력값
        joinTeamId:"",

        // 닉네임 입력값
        nicknameInput:""

    }

},


methods:{


    // 팀 생성
    createTeam(){

        if(!this.createTeamName){

            alert("팀 이름을 입력해주세요.");

            return;

        }


        this.$emit(
            "create-team",
            this.createTeamName
        );


        this.createTeamName="";


    },



    // 팀 참여
    joinTeam(){

        if(!this.joinTeamId){

            alert("팀 ID를 입력해주세요.");

            return;

        }


        if(!this.nicknameInput){

            alert("닉네임을 입력해주세요.");

            return;

        }


        this.$emit(
            "join-team",
            {

                id:this.joinTeamId,

                nickname:this.nicknameInput

            }
        );


    }


}


}

</script>



<style scoped>


/* 전체 화면 */

.login-page{

    min-height:100vh;

    background:#FFF2A8;

    display:flex;

    flex-direction:column;

    justify-content:center;

    align-items:center;

}



/* 로고 */

.logo-area{

    text-align:center;

    margin-bottom:40px;

}



.corn-logo{

    font-size:80px;

}



.logo-area h1{

    margin:10px 0;

    font-size:42px;

    color:#5a4800;

}



.logo-area p{

    color:#806800;

    font-size:18px;

}



/* 좌우 카드 */

.card-container{

    display:flex;

    flex-direction:row;

    gap:50px;

}



/* 카드 */

.login-card{


    width:320px;

    padding:35px;


    background:white;


    border-radius:25px;


    box-shadow:

    0 10px 25px rgba(0,0,0,0.15);


}



/* 카드 제목 */

.login-card h2{


    text-align:center;


    color:#5a4800;


    margin-bottom:15px;


}



.login-card p{


    text-align:center;


    color:#806800;


    margin-bottom:25px;


}



/* 입력창 */

input{


    width:100%;


    height:45px;


    border:none;


    background:#fff8d6;


    border-radius:10px;


    padding:0 15px;


    margin-bottom:15px;


    box-sizing:border-box;


    font-size:15px;


}



input:focus{


    outline:2px solid #F4C430;


}



/* 버튼 */

button{


    width:100%;


    height:45px;


    border:none;


    border-radius:12px;


    background:#F4B400;


    color:white;


    font-size:16px;


    font-weight:bold;


    cursor:pointer;


}



button:hover{


    background:#D99C00;


}



</style>
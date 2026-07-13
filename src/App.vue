<template>

  <!-- 로그인 화면 -->
  <Login 
    v-if="view === 'login'"
    @create-team="createTeam"
    @join-team="joinTeam"
  />

  <Home 
    v-else
    :currentTeam="currentTeam"
  />

</template>

<script>

import Login from "./components/Login.vue"
import Home from "./components/Home.vue"

export default {

components:{
    Login,
    Home
},

data(){

    return {

        // 팀 데이터 저장소
        teams:{},


        // 현재 접속 팀
        currentTeam:null,


        // 사용자 닉네임
        nickname:"",


        // 화면 상태
        view:"login"

    }

},

methods:{

    // Login.vue에서 받은 팀 이름
    createTeam(teamName){

        const id = Math.random()
            .toString(36)
            .substring(2,7);

        this.teams[id]={
            name:teamName,
            members:[],
            schedule:[],
            vote:[],
            messages:[]
        };

        this.currentTeam=id;
        this.view="main";

        alert(
            "팀 생성 완료\n팀 ID : "+id
        );

    },

    // Login.vue에서 받은 입장 정보
    joinTeam(data){

        if(!this.teams[data.id]){
            alert("존재하지 않는 팀입니다.");
            return;
        }

        this.currentTeam=data.id;
        
        this.nickname=data.nickname;

        this.teams[data.id]
            .members
            .push(data.nickname);

        this.view="main";

    }

}

}

</script>
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
    :notifications="teams[currentTeam].notifications"
    @add-schedule="addSchedule"
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

        teams:{},

        currentTeam:null,

        nickname:"",

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
            notifications:[],
            vote:[],
            messages:[],
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

    },

    // Schedule.vue에서 일정 받아서 현재 팀에 저장
    addSchedule(schedule){
        // 1. 일정 저장 
        this.teams[this.currentTeam].schedule.push(schedule);

        // 2. 알림 생성
        this.teams[this.currentTeam].notifications.push({
            message: `${schedule.title} 일정이 등록되었습니다.`,
            data: schedule.data,
            time: schedule.time
        });
    }

}

}

</script>
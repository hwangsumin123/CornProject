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
    :notifications="teams[currentTeam]?.notifications || []"
    :members="teams[currentTeam]?.members || []"
    :messages="teams[currentTeam]?.messages || []"
    :teams="teams"
    @add-schedule="addSchedule"
    @delete-schedule="deleteSchedule"
    @send-message="sendMessage"
    @logout="logout"
  />

</template>

<script>

import Login from "./components/Login.vue"
import Home from "./components/Home.vue"
import { db } from "./firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

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
    async createTeam(data){
        try{
            const id = Math.random()
                .toString(36)
                .substring(2,7);

            const newTeam = {
                name:data.teamName,
                members:[data.nickname],
                schedule:[],
                notifications:[],
                vote:[],
                messages:{},
            };

            await setDoc(
                doc(db, "teams", id),
                newTeam
            );

            this.teams[id] = newTeam;

            this.currentTeam=id;

            localStorage.setItem(
                "currentTeam", id
            );

            this.nickname=data.nickname;

            localStorage.setItem(
                    "nickname", data.nickname
            );

            this.view="main";

            alert("팀 생성 완료\n팀 ID : "+id);
        } catch(error){
            console.error(
            "팀 생성 오류:",
            error
            );

            alert("팀 생성 중 오류가 발생했습니다.");
        }
    },

    // Login.vue에서 받은 입장 정보
    async joinTeam(data){
        const teamRef = doc(db, "teams", data.id);
        const teamSnap = await getDoc(teamRef);

        if(!teamSnap.exists()){
            alert("존재하지 않는 팀입니다.");
            return;
        }

        this.teams[data.id] = teamSnap.data();

        this.currentTeam=data.id;

        localStorage.setItem(
            "currentTeam", data.id
        );

        this.nickname=data.nickname;

        localStorage.setItem(
            "nickname", data.nickname
        );

        if(!this.teams[data.id].members){
            this.teams[data.id].members=[];
        }

        if(!this.teams[data.id].members.includes(data.nickname)){
            this.teams[data.id]
            .members
            .push(data.nickname);

            await updateDoc(teamRef, {
            members:this.teams[data.id].members
        });
        }

        this.view="main";
    },

    // Schedule.vue에서 일정 받아서 현재 팀에 저장
    async addSchedule(schedule){
        // 1. 일정 저장 
        this.teams[this.currentTeam].schedule.push(schedule);

        // 2. 알림 생성
        this.teams[this.currentTeam].notifications.push({
            message: `${schedule.title} 일정이 등록되었습니다.`,
            data: schedule.data,
            time: schedule.time
        });

        const teamRef = doc(
        db,
        "teams",
        this.currentTeam
        );

        await updateDoc(teamRef, {
            schedule: this.teams[this.currentTeam].schedule,
            notifications: this.teams[this.currentTeam].notifications
        });
    },

    async deleteSchedule(id){
        const team = this.teams[this.currentTeam];

        team.schedule = team.schedule.filter(
            schedule => schedule.id !== id
        );


        const teamRef = doc(
            db,
            "teams",
            this.currentTeam
        );


        await updateDoc(teamRef,{
            schedule: team.schedule
        });
    },

async sendMessage(data){
        const team=this.teams[this.currentTeam];

        if(!team){
            return;
        }

        if(!team.messages[data.receiver]){
            team.messages[data.receiver]=[];
        }

        team.messages[data.receiver].push({
            id:Date.now(),
            text:data.text
        });

        const teamRef = doc(db, "teams", this.currentTeam);

        await updateDoc(teamRef, {messages:team.messages});
    },

    logout(){
        localStorage.removeItem("currentTeam");
        localStorage.removeItem("nickname");

        this.currentTeam = null;
        this.nickname = "";
        this.teams = {};

        this.view = "login";
    },

},


async mounted(){
    const savedTeam = localStorage.getItem("currentTeam");
    const savedNickname = localStorage.getItem("nickname");

    if(!savedTeam) {
        return;
    }

    const teamRef = doc(db, "teams", savedTeam);
    const teamSnap = await getDoc(teamRef);

    if(teamSnap.exists()){
        this.teams[savedTeam] = teamSnap.data();

        this.currentTeam = savedTeam;

        this.nickname = savedNickname || "";

        this.view = "main";}
    

}
}


</script>
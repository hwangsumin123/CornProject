<template>

<div>
    
<h1>Task Manager</h1>

    <h3>팀 만들기</h3>
    <input v-model="createTeamName" placeholder="팀 이름" />
    <button @click="createTeam">팀 생성</button>

    <h3>팀 입장</h3>
    <input v-model="joinTeamId" placeholder="팀 ID" />
    <input v-model="nicknameInput" placeholder="닉네임" />
    <button @click="joinTeam">입장</button>    

</div>

</template>

<script>

export default {

data(){

    return {

        // 팀 이름 입력값
        createTeamName:"",

        // 팀 ID 입력값
        joinTeamId:"",

        // 닉네임 입력값
        nicknameInput:""

    }

},
methods:{

    // 팀 생성 버튼 클릭
    createTeam(){

        if(!this.createTeamName){
            alert("팀 이름을 입력해주세요.");
            return;
        }

        // App.vue로 팀 이름 전달
        this.$emit(
            "create-team",
            this.createTeamName
        );

        this.createTeamName="";

    },

    // 팀 입장 버튼 클릭
    joinTeam(){

        if(!this.joinTeamId){
            alert("팀 ID를 입력해주세요.");
            return;
        }

        if(!this.nicknameInput){
            alert("닉네임을 입력해주세요.");
            return;
        }

        // App.vue로 데이터 전달
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
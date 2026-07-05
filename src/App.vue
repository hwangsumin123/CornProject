<template>

<div v-if="view === 'login'">
    
    <h1>Task Manager</h1>

    <h3>팀 만들기</h3>
    <input v-model="createTeamName" placeholder="팀 이름" />
    <button @click="createTeam">팀 생성</button>

    <h3>팀 입장</h3>
    <input v-model="joinTeamId" placeholder="팀 ID" />
    <input v-model="nicknameInput" placeholder="닉네임" />
    <button @click="joinTeam">입장</button>

</div>

//메인 화면
<div else>
</div>


</template>

<script>
export default {
    data() {
        return {
            teams: {}, //팀 데이터 저장소

            //현재 상태
            currentTeam: null,
            nickname: "",

            view: "login", //화면 상테

            //입력 값
            createTeamName: "",
            joinTeamId: "",
            nicknameInput: ""
        }
    },
    methods: {
        createTeam(){
            if(!this.createTeamName){
                alert("팀 이름을 입력해주세요.");
                return;
            }

            //랜덤 팀 ID 생성
            const id = Math.random().toString(36).substring(2, 7);

            //팀 객체 생성
            this.teams[id] = {
                name: this.createTeamName,
                members: [],
                schedule: [],
                vote: [],
                messages: []
            };

            alert("팀 생성이 완료되었습니다!\n팀 ID: " + id);

            // 입력 초기화
            this.createTeamName = "";
        },
        joinTeam(){
            if(!this.teams[this.joinTeamId]){
                alert("존재하지 않는 팀입니다.");
                return;
            }

            if(!this.nicknameInput){
                alert("닉네임을 입력해주세요.");
                return;
            }

            // 상태 저장
            this.currentTeam = this.joinTeamId;
            this.nickname = this.nicknameInput;

            // 팀 멤버 추가
            this.teams[this.joinTeamId].members.push(this.nickname);

            // 화면 전환
            this.view = "main";
        }
    }
}
</script>
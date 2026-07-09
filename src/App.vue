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
<div v-else>

<div class="main-container">
      
      <div class="sidebar">//왼쪽 사이드
        <h2>메뉴</h2>
        <button>일정 조율</button>
        <button>투표</button>
        <button>DM</button>
      </div>

      <div class="right-area">//오른쪽 위 팀이아디,알림
        
        <div class="header">
          <span class="team-id-display">팀 ID : {{ currentTeam }}</span>
          
          <div class="notification-wrapper">
            <button @click="showNotification = !showNotification">🔔</button>
            //알림버튼 눌르면 알림들 모여있는 창 띄울때 변수 showNotification
          </div>
        </div>

        <div class="center">
          <h2>공유 달력</h2>
          <p>여기에 달력 </p>
        </div>

      </div>
    </div>

<style scoped>//메인화면 css
.main-container {
  display: flex;
  height: 100vh; 
}

.sidebar {
  width: 200px;
  background-color: #f4f4f4;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-right: 1px solid #ddd;
}

.sidebar button {
  padding: 10px;
  cursor: pointer;
}

.right-area {
  flex-grow: 1; 
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 15px 30px;
  background-color: #e9ecef;
  gap: 20px;
  border-bottom: 1px solid #ddd;
}

.notification-wrapper {//알림창기준점
  position: relative;
}

.notification-box {//알림창 박스
  position: absolute;
  top: 40px;
  right: 0;
  width: 250px;
  background-color: white;
  border: 1px solid #ccc;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.center {
  padding: 40px;
  text-align: center;
  flex-grow: 1;
}
</style>
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
            nicknameInput: "",

            showNotification: false//알림창
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
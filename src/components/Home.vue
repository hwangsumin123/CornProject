<template>

<div class="main-container">

    <!-- 왼쪽 사이드 -->
    <Sidebar @menu-select="handleMenuSelect" />

      <div class="right-area"> 
        
        <!-- 오른쪽 위 팀 ID, 알림 -->
        <div class="header">

          <span class="team-id-display">팀 ID : {{ currentTeam }}</span>
          <button class="logout-btn" @click="$emit('logout')">나가기</button>
          
           <div class="notification-wrapper">

            <!-- 알림버튼 누르면 알림들 모여있는 창 띄울때 변수 showNotification -->
            <button class="bell-btn" @click="showHistory = !showHistory">🔔</button>

            <div v-if="showHistory || showNotification" class="notification-box">
              <p v-if="showNotification">
                🔔 {{newNotification}}
              </p>
              
              <p v-if="showHistory">
                <p v-if="!teams[currentTeam]?.notifications?.length">
                  알림이 없습니다.
                </p>

                <p v-for="notice in teams[currentTeam]?.notifications || []"
                 :key="notice.time">
                  🔔 {{notice.message}}
                </p>
              </p>
            </div>
          
            </div>

        </div>

<div class="center">

<div v-if="selectedMenu === null">
    <Calendar :schedules="teams[currentTeam]?.schedule || []" />
  </div>

  <div v-else-if="selectedMenu === 'schedule'">
    <Schedule
    :schedules="teams[currentTeam]?.schedule || []"
    @add-schedule="addSchedule"
    @delete-schedule="deleteSchedule"
/>
  </div>

  <div v-else-if="selectedMenu === 'vote'">
    <Vote :currentTeam="currentTeam" />
  </div>

  <div v-else-if="selectedMenu === 'dm'">
    <DM
    :members="members"
    :currentTeam="currentTeam" 
    :currentUser="nickname"/>
  </div>

</div>

      </div>

</div>

</template>
    
<script>

import Sidebar from "./Sidebar.vue"
import Schedule from "./Schedule.vue"
import Vote from "./Vote.vue"  
import DM from "./DM.vue"
import { db } from "../firebase";
import Calendar from "./Calendar.vue"
import { doc, updateDoc } from "firebase/firestore";

export default {

components:{
    Sidebar,
    Schedule,
    Vote,
    DM,
    Calendar
},
    
props:[
    "currentTeam",
    "nickname",
    "members",
    "messages",
    "teams"
],

data(){

    return{
        // 알림창 표시 여부
        showNotification:false,
        newNotification:"",
        showHistory:false,
        selectedMenu:null
    }

},

methods:{
 handleMenuSelect(id){       
    this.selectedMenu = id;
  },
  addSchedule(schedule){
    this.$emit("add-schedule", schedule);

    this.newNotification = `${schedule.title} 일정이 등록되었습니다.`;

    this.showNotification = true;

    setTimeout(()=>{
      this.showNotification = false;
      this.newNotification = "";
    }, 3000);
  },
  sendMessage(data){
    this.$emit(
      "send-message",
      data
    );
  },
  deleteSchedule(id){
    this.$emit(
      "delete-schedule", id
    );
  }  
  
}

}

</script>

<style scoped>

.main-container {
  margin-left: 200px;
  min-height: 100vh;
  display: flex;
}

.right-area {
  flex-grow: 1; 
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 15px 30px;
  background-color: #75b968;
  gap: 20px;
  border-bottom: none;
}

/*알림버튼 - 버튼 테두리/배경 없애고 종 아이콘만 보이게*/
.bell-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

/*알림창 기준점*/
.notification-wrapper {
  position: relative;
  z-index: 1000;
}

.notification-box{
    position:absolute;
    top:45px;
    right:0;
    width:250px;
    background:white;
    border-radius:15px;
    padding:15px;
    box-shadow:
    0 5px 15px rgba(0,0,0,0.15);
    z-index:1000;
}

.center {
  padding: 15px 40px 15px 60px;
  text-align: center;
  flex-grow: 1;
  min-height: 0;
}

.notification-box{
    position:absolute;
    top:45px;
    right:0;
    width:250px;
    background:white;
    border-radius:15px;
    padding:15px;
    box-shadow:
    0 5px 15px rgba(0,0,0,0.15);
}


.notification-box p{
    margin:10px 0;
    color:#5a4800;
}
.logout-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  font-weight: bold;
}

</style>
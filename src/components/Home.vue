<template>

<div class="main-container">

    <!-- 왼쪽 사이드 -->
    <Sidebar />

      <div class="right-area"> 
        
        <!-- 오른쪽 위 팀 ID, 알림 -->
        <div class="header">

          <span class="team-id-display">팀 ID : {{ currentTeam }}</span>
          
           <div class="notification-wrapper">

            <!-- 알림버튼 누르면 알림들 모여있는 창 띄울때 변수 showNotification -->
            <button class="bell-btn" @click="showNotification = !showNotification">🔔</button>
          
            </div>

        </div>

        <div class="center">

          <h2>공유 달력</h2>
          
          <Schedule />

        </div>

      </div>

</div>

</template>
    
<script>

import Sidebar from "./Sidebar.vue"
import Schedule from "./Schedule.vue"

export default {

components:{
    Sidebar,
    Schedule
},
    
props:[
    "currentTeam"
],

data(){

    return{

        // 알림창 표시 여부
        showNotification:false

    }

}

}

</script>

<style scoped>

.main-container {
  display: flex;
  height: 100vh; 
}

.sidebar {
  width: 200px;
  background-color: #fffbe6;
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
  background-color: #a1d69f;
  gap: 20px;
  border-bottom: 1px solid #ddd;
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
}

/*알림창 박스*/
.notification-box {
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
<template>
  <div class="corn-app">
    <!-- 1. 초기 접속 화면 (로그인 / 방 생성 및 참여) -->
    <div v-if="!currentStep" class="auth-container">
      <div class="auth-card">
        <div class="auth-logo">🌽</div>
        <h2>Corn Space에 오신 것을 환영합니다</h2>
        <p class="subtitle">팀을 생성하거나 기존 팀에 참여하세요.</p>
        
        <div class="auth-buttons">
          <button @click="authMode = 'create'" :class="{ active: authMode === 'create' }">팀 만들기</button>
          <button @click="authMode = 'join'" :class="{ active: authMode === 'join' }">팀원으로 참여하기</button>
        </div>

        <!-- 팀 만들기 폼 -->
        <div v-if="authMode === 'create'" class="form-group">
          <label>팀 이름</label>
          <input v-model="teamName" type="text" placeholder="멋진 팀 이름을 입력하세요">
          <label>자동 생성된 팀 ID</label>
          <input :value="generatedTeamId" type="text" readonly class="readonly-input">
          <label>본인 닉네임</label>
          <input v-model="userNickname" type="text" placeholder="닉네임 입력">
          <button @click="enterTeam('create')" class="submit-btn" :disabled="!teamName || !userNickname">방 생성 및 입장</button>
        </div>

        <!-- 팀원으로 참여 폼 -->
        <div v-if="authMode === 'join'" class="form-group">
          <label>팀 ID 입력</label>
          <input v-model="inputTeamId" type="text" placeholder="공유받은 팀 ID를 입력하세요">
          <label>본인 닉네임</label>
          <input v-model="userNickname" type="text" placeholder="닉네임 입력">
          <button @click="enterTeam('join')" class="submit-btn" :disabled="!inputTeamId || !userNickname">팀 참여 및 입장</button>
        </div>
      </div>
    </div>

    <!-- 2. 메인 서비스 화면 -->
    <div v-else class="main-container">
      <!-- 상단 배너 (팀 ID 표시) -->
      <header class="top-banner">
        <div class="banner-logo">🌽 Corn Space</div>
        <div class="team-info-badge">
          <span class="label">TEAM ID:</span>
          <span class="id-value">{{ activeTeamId }}</span>
        </div>
        <div class="user-badge">{{ userNickname }}님</div>
      </header>

      <div class="workspace">
        <!-- 사이드바 탭 구성 -->
        <aside class="sidebar">
          <nav class="nav-menu">
            <button @click="currentTab = 'home'" :class="{ active: currentTab === 'home' }">🏠 홈 화면</button>
            <button @click="currentTab = 'schedule'" :class="{ active: currentTab === 'schedule' }">📅 일정 조율</button>
            <button @click="currentTab = 'vote'" :class="{ active: currentTab === 'vote' }">🗳️ 투표</button>
            <button @click="currentTab = 'dm'" :class="{ active: currentTab === 'dm' }">💬 DM / 채팅</button>
          </nav>
        </aside>

        <!-- 메인 콘텐츠 영역 -->
        <main class="content-area">
          
          <!-- [탭 0] 홈 화면 -->
          <div v-if="currentTab === 'home'" class="dashboard-grid">
            <!-- 왼쪽: 공유 달력 -->
            <div class="panel calendar-panel">
              <h3>📅 공유 달력</h3>
              <div class="mock-calendar">
                <div class="calendar-header">2026년 7월</div>
                <div class="calendar-grid">
                  <div v-for="d in 31" :key="d" class="calendar-day" :class="{ has-event: d === 15 }">
                    <span class="day-num">{{ d }}</span>
                    <div v-if="d === 15" class="day-event-dot">📌</div>
                  </div>
                </div>
              </div>
              <div class="event-list">
                <h4>확정된 일정</h4>
                <ul>
                  <li v-for="(evt, i) in confirmedSchedules" :key="i">
                    <strong>{{ evt.title }}</strong> | 📍 {{ evt.location }}
                  </li>
                  <li v-if="confirmedSchedules.length === 0" class="empty-text">아직 확정된 일정이 없습니다.</li>
                </ul>
              </div>
            </div>
            
            <!-- 오른쪽: 알림 -->
            <div class="panel notification-panel">
              <h3>🔔 알림 센터</h3>
              <div class="notification-list">
                <div v-for="(noti, i) in notifications" :key="i" class="noti-item" :class="noti.type">
                  <p class="noti-text">{{ noti.message }}</p>
                  <span class="noti-time">{{ noti.time }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- [탭 1] 일정 조율 -->
          <div v-if="currentTab === 'schedule'" class="panel-single">
            <h3>📅 일정 조율 등록 (팀장 권한)</h3>
            <div class="schedule-form">
              <div class="input-row">
                <input v-model="newSchedule.title" type="text" placeholder="일정 이름 (예: 정기 개발 회의)">
                <input v-model="newSchedule.location" type="text" placeholder="장소 (예: 강남역 스터디룸)">
                <button @click="registerSchedule" class="action-btn">일정 등록 및 알림 발송</button>
              </div>
            </div>
          </div>

          <!-- [탭 2] 투표 -->
          <div v-if="currentTab === 'vote'" class="panel-single">
            <h3>🗳️ 진행 중인 투표</h3>
            <div class="vote-container">
              <div class="vote-card">
                <h4>⏰ 일정 투표: 이번 주 정기 모임 시간은?</h4>
                <button @click="addNotification('일정 투표에 참여했습니다.', 'info')" class="vote-option-btn">A안: 토요일 오후 2시 (현재 3표)</button>
                <button @click="addNotification('일정 투표에 참여했습니다.', 'info')" class="vote-option-btn">B안: 일요일 오전 11시 (현재 5표)</button>
              </div>
              <div class="vote-card">
                <h4>📍 장소 투표: 어디서 만날까요?</h4>
                <button @click="addNotification('장소 투표에 참여했습니다.', 'info')" class="vote-option-btn">후보 1: 홍대 옥수수 카페 (현재 6표)</button>
                <button @click="addNotification('장소 투표에 참여했습니다.', 'info')" class="vote-option-btn">후보 2: 강남역 코워킹스페이스 (현재 2표)</button>
              </div>
            </div>
          </div>

          <!-- [탭 3] DM -->
          <div v-if="currentTab === 'dm'" class="dm-layout">
            <div class="dm-sidebar">
              <div class="dm-room-item active">🌽 팀 전체 단체방</div>
              <div class="dm-room-item">🧑 김개발 (1:1)</div>
              <div class="dm-room-item">👩 이디자이너 (1:1)</div>
            </div>
            <div class="dm-chat-window">
              <div class="chat-messages">
                <div class="msg system">익명의 옥수수들이 입장했습니다.</div>
                <div v-for="(msg, i) in chatMessages" :key="i" class="msg" :class="{ 'my-msg': msg.sender === userNickname }">
                  <span class="sender">{{ msg.sender }}</span>
                  <p class="text">{{ msg.text }}</p>
                </div>
              </div>
              <div class="chat-input-bar">
                <input v-model="chatInput" @keyup.enter="sendChat" type="text" placeholder="메시지를 입력하세요...">
                <button @click="sendChat">전송</button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>

    <!-- 하단 고정 옥수수 로고 -->
    <footer class="footer-logo">
      <span class="corn-icon">🌽</span>
      <span class="corn-text">corn_log_under_web</span>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 시스템 네비게이션 상태
const currentStep = ref(null) // null: 인증화면, 'main': 메인서비스
const authMode = ref('create') // 'create' 또는 'join'
const currentTab = ref('home') // 'home', 'schedule', 'vote', 'dm'

// 사용자 입력 데이터
const teamName = ref('')
const inputTeamId = ref('')
const userNickname = ref('')
const activeTeamId = ref('')

// 가상의 팀 ID 자동 생성 (랜덤 값)
const generatedTeamId = computed(() => {
  return 'CORN-' + Math.floor(100000 + Math.random() * 900000)
})

// 가상 데이터 상태 관리
const confirmedSchedules = ref([
  { title: '데모 데이 최종 리허설', location: '온라인 Zoom' }
])
const newSchedule = ref({ title: '', location: '' })

const notifications = ref([
  { message: '새로운 일정 [데모 데이 최종 리허설]이 등록되었습니다.', time: '방금 전', type: 'success' },
  { message: '[팀 매칭 완료] 1시간 뒤 일정이 있습니다.', time: '1시간 전', type: 'warn' }
])

const chatMessages = ref([
  { sender: '김개발', text: '안녕하세요! 옥수수방 방장님 반갑습니다.' }
])
const chatInput = ref('')

// 방 입장 로직
const enterTeam = (mode) => {
  if (mode === 'create') {
    activeTeamId.value = generatedTeamId.value
  } else {
    activeTeamId.value = inputTeamId.value
  }
  currentStep.value = 'main'
  addNotification(`${userNickname.value}님이 팀에 참여하셨습니다.`, 'success')
}

// 일정 등록 프로세스
const registerSchedule = () => {
  if (!newSchedule.value.title || !newSchedule.value.location) return
  
  // 공유 달력 업데이트
  confirmedSchedules.value.push({
    title: newSchedule.value.title,
    location: newSchedule.value.location
  })
  
  // 팀원들 알람 발송 시뮬레이션
  addNotification(`새로운 일정 [${newSchedule.value.title}]이 등록되었습니다.`, 'success')
  
  // 폼 초기화
  newSchedule.value.title = ''
  newSchedule.value.location = ''
  currentTab.value = 'home' // 홈 화면으로 이동해서 확인 유도
}

// 알림 추가 함수
const addNotification = (message, type = 'success') => {
  notifications.value.unshift({
    message,
    time: '방금 전',
    type
  })
}

// 채팅 전송
const sendChat = () => {
  if (!chatInput.value.trim()) return
  chatMessages.value.push({
    sender: userNickname.value,
    text: chatInput.value
  })
  chatInput.value = ''
}
</script>

<style scoped>
/* 옥수수 노란색 컬러 팔레트 변수 정의 */
:deep(*) {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Pretendard', -apple-system, sans-serif;
}

.corn-app {
  --yellow-main: #FFDE4D;
  --yellow-light: #FEEFAD;
  --yellow-bg: #FFFBEB;
  --dark-text: #343A40;
  --border-color: #E9ECEF;
  
  background-color: var(--yellow-bg);
  min-height: 100vh;
  color: var(--dark-text);
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 60px; /* 푸터 공간 */
}

/* 1. 초기 접속 화면 스타일 */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 20px;
}
.auth-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(255, 222, 77, 0.2);
  width: 100%;
  max-width: 480px;
  text-align: center;
}
.auth-logo {
  font-size: 4rem;
  margin-bottom: 10px;
}
.subtitle {
  color: #6C757D;
  margin-bottom: 30px;
  font-size: 0.95rem;
}
.auth-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}
.auth-buttons button {
  flex: 1;
  padding: 12px;
  border: 2px solid var(--yellow-main);
  background: transparent;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}
.auth-buttons button.active, .auth-buttons button:hover {
  background: var(--yellow-main);
}
.form-group {
  text-align: left;
}
.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: bold;
  margin-bottom: 6px;
  color: #495057;
}
.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 18px;
  font-size: 1rem;
}
.form-group input:focus {
  outline: 2px solid var(--yellow-main);
}
.readonly-input {
  background: #F8F9FA;
  font-family: monospace;
  letter-spacing: 1px;
}
.submit-btn {
  width: 100%;
  padding: 14px;
  background: var(--yellow-main);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}
.submit-btn:disabled {
  background: #E9ECEF;
  cursor: not-allowed;
}

/* 2. 메인 화면 레이아웃 */
.main-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.top-banner {
  background: var(--yellow-main);
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
.banner-logo {
  font-size: 1.25rem;
}
.team-info-badge {
  background: rgba(255,255,255,0.6);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
}
.team-info-badge .id-value {
  margin-left: 6px;
  color: #D44000;
}
.workspace {
  display: flex;
  flex: 1;
}

/* 사이드바 배치 */
.sidebar {
  width: 240px;
  background: white;
  border-right: 1px solid var(--border-color);
  padding: 20px 10px;
}
.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.nav-menu button {
  width: 100%;
  padding: 14px 16px;
  text-align: left;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.nav-menu button:hover, .nav-menu button.active {
  background: var(--yellow-light);
  font-weight: bold;
}

/* 메인 콘텐츠 구조 */
.content-area {
  flex: 1;
  padding: 30px;
}
.panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--border-color);
}
.panel-single {
  background: white;
  border-radius: 12px;
  padding: 30px;
  border: 1px solid var(--border-color);
  min-height: 400px;
}

/* 홈 화면 Grid (달력 왼쪽, 알림 오른쪽) */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
}

/* 가상 달력 디자인 */
.mock-calendar {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
}
.calendar-header {
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}
.calendar-day {
  aspect-ratio: 1;
  border: 1px solid #F1F3F5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px;
  font-size: 0.8rem;
  position: relative;
}
.calendar-day.has-event {
  background: var(--yellow-bg);
  border-color: var(--yellow-main);
  font-weight: bold;
}
.day-event-dot {
  font-size: 0.7rem;
  text-align: center;
}
.event-list h4 {
  margin-top: 20px;
  margin-bottom: 8px;
  font-size: 0.95rem;
}
.event-list li {
  padding: 8px;
  background: #F8F9FA;
  border-radius: 6px;
  margin-bottom: 6px;
  list-style: none;
  font-size: 0.9rem;
}

/* 알림 센터 디자인 */
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 15px;
}
.noti-item {
  padding: 12px;
  border-left: 4px solid var(--yellow-main);
  background: #F8F9FA;
  border-radius: 0 8px 8px 0;
}
.noti-item.warn {
  border-left-color: #FA5252;
  background: #FFF5F5;
}
.noti-text {
  font-size: 0.9rem;
  margin-bottom: 4px;
}
.noti-time {
  font-size: 0.75rem;
  color: #868E96;
}

/* 일정 조율 폼 */
.schedule-form {
  margin-top: 20px;
}
.input-row {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 500px;
}
.input-row input {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}
.action-btn {
  padding: 12px;
  background: var(--yellow-main);
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

/* 투표 UI */
.vote-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}
.vote-card {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 20px;
}
.vote-card h4 {
  margin-bottom: 12px;
}
.vote-option-btn {
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px;
  background: #F8F9FA;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
}
.vote-option-btn:hover {
  background: var(--yellow-light);
}

/* DM 디자인 */
.dm-layout {
  display: flex;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: white;
  height: 450px;
}
.dm-sidebar {
  width: 200px;
  border-right: 1px solid var(--border-color);
  padding: 10px;
}
.dm-room-item {
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}
.dm-room-item.active, .dm-room-item:hover {
  background: #F8F9FA;
  font-weight: bold;
}
.dm-chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.msg {
  max-width: 70%;
  align-self: flex-start;
}
.msg.my-msg {
  align-self: flex-end;
}
.msg .sender {
  font-size: 0.75rem;
  color: #6C757D;
  display: block;
  margin-bottom: 2px;
}
.msg.my-msg .sender {
  text-align: right;
}
.msg .text {
  background: #F1F3F5;
  padding: 10px 14px;
  border-radius: 0 12px 12px 12px;
  font-size: 0.9rem;
}
.msg.my-msg .text {
  background: var(--yellow-light);
  border-radius: 12px 0 12px 12px;
}
.msg.system {
  align-self: center;
  font-size: 0.8rem;
  color: #868E96;
}
.chat-input-bar {
  display: flex;
  border-top: 1px solid var(--border-color);
  padding: 10px;
}
.chat-input-bar input {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px 0 0 6px;
}
.chat-input-bar button {
  padding: 10px 20px;
  background: var(--yellow-main);
  border: none;
  border-radius: 0 6px 6px 0;
  font-weight: bold;
  cursor: pointer;
}

/* 3. 하단 고정 옥수수 로고 */
.footer-logo {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: white;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.corn-icon {
  font-size: 1.2rem;
}
.corn-text {
  font-size: 0.85rem;
  color: #868E96;
  font-family: monospace;
}
.empty-text {
  color: #ADB5BD;
  font-size: 0.85rem;
  text-align: center;
  padding: 10px 0;
}
</style>
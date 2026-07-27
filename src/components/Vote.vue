<template>
<div class="vote-wrapper">

  <!-- 일정투표 하나(장소+날짜+시간 다 포함)를 통째로 반복해서 그려줌 -->
  <div v-for="(vote, vIndex) in votes" :key="vIndex" class="vote-block">

    <!-- 이 투표 덩어리의 제목 (예: 1차 회의) -->
    <input v-model="vote.title" placeholder="일정 제목" class="vote-title-input" />

    <!-- 투표 진행중일 때: 장소/날짜/시간 후보 다 보여줌 -->
    <div v-if="!vote.ended">

      <div v-for="cat in categoryList" :key="cat.key" class="vote-section">
        <h4 class="section-label">{{ cat.icon }} {{ cat.label }}</h4>

        <div v-for="(item, idx) in vote[cat.key].candidates" :key="idx" class="candidate-row">

          <!-- 장소: 텍스트 입력 -->
          <input v-if="cat.key === 'place'" v-model="item.value" type="text" placeholder="장소" class="text-input" />

          <!-- 날짜: 달력 + 요일 자동 표시 -->
          <template v-else-if="cat.key === 'date'">
            <input v-model="item.date" type="date" class="date-picker" />
           </template>

          <!-- 시간: 오전/오후 + 시 + 분 -->
          <template v-else>
            <select v-model="item.period" class="date-input">
              <option value="오전">오전</option>
              <option value="오후">오후</option>
            </select>
            <input v-model.number="item.hour" type="number" placeholder="시" class="date-input" />시
            <input v-model.number="item.minute" type="number" placeholder="분" class="date-input" />분
          </template>

          <span class="vote-count">{{ item.votes }}표</span>
          <button @click="toggleVote(item)" class="vote-btn">
            {{ item.voted ? "✅ 취소" : "투표하기" }}
          </button>

        </div>

        <button @click="addCandidate(vote, cat.key)" class="add-btn">＋ {{ cat.label }} 후보 추가</button>
      </div>

      <!-- 장소/날짜/시간 다 합쳐서 투표종료 버튼 하나만 -->
      <button @click="vote.ended = true" class="end-btn">🛑 투표종료</button>

      <!-- 이 투표 덩어리 자체를 통째로 삭제 -->
      <button @click="deleteVote(vIndex)" class="delete-vote-btn">🗑 투표삭제</button>

    </div>

    <!-- 투표 종료 후: 결과만, 표 많은 순서대로 -->
    <div v-else>
      <div v-for="cat in categoryList" :key="cat.key" class="result-section">
        <h4 class="section-label">{{ cat.icon }} {{ cat.label }} 결과</h4>
        <div v-for="(item, idx) in sortedResults(vote, cat.key)" :key="idx" class="result-row">
          <span>{{ formatLabel(cat.key, item) }}</span>
          <span class="vote-count">{{ item.votes }}표</span>
        </div>
      </div>
    </div>

  </div>

  <!-- 새 일정투표 통째로 추가 (1차 회의, 2차 회의 등) -->
  <button @click="addVote" class="add-vote-btn">＋ 새 일정투표 추가</button>

</div>
</template>

<script>
export default {
  name: "Vote",

  data() {
    return {
      // 장소/날짜/시간 표시용 정보
      categoryList: [
        { key: "place", label: "장소", icon: "📍" },
        { key: "date", label: "날짜", icon: "📅" },
        { key: "time", label: "시간", icon: "⏰" }
      ],

      // 투표 덩어리들 (1차 회의, 2차 회의 처럼 여러 개 가능)
      votes: [this.createVote()]
    };
  },

  methods: {
    // 투표 덩어리 하나 생성 (제목 + 장소/날짜/시간 후보 각각 1개씩 포함)
    createVote() {
      return {
        title: "",
        ended: false,
        place: { candidates: [this.createCandidate("place")] },
        date: { candidates: [this.createCandidate("date")] },
        time: { candidates: [this.createCandidate("time")] }
      };
    },

    // 타입(장소/날짜/시간)에 맞는 빈 후보 객체 생성
    createCandidate(type) {
      if (type === "place") return { value: "", votes: 0, voted: false };
      if (type === "date") return { date: "", votes: 0, voted: false };
      return { period: "오전", hour: null, minute: null, votes: 0, voted: false };
    },

    // "새 일정투표 추가" 버튼: votes 배열에 투표 덩어리 하나 추가
    addVote() {
      this.votes.push(this.createVote());
    },

    // 특정 투표 덩어리(vote)의 특정 카테고리(type)에 후보 하나 추가
    addCandidate(vote, type) {
      vote[type].candidates.push(this.createCandidate(type));
    },

    // 투표 덩어리(장소+날짜+시간 통째로) 삭제
    deleteVote(vIndex) {
      this.votes.splice(vIndex, 1);
    },

    // 투표하기 / 취소 (후보마다 따로 동작하니까 자동으로 복수투표 가능)
    toggleVote(item) {
      if (item.voted) {
        item.votes--;
        item.voted = false;
      } else {
        item.votes++;
        item.voted = true;
      }
    },

    // 표 많은 순서대로 정렬한 결과 반환
    sortedResults(vote, type) {
      return [...vote[type].candidates].sort((a, b) => b.votes - a.votes);
    },

    // 날짜 문자열로 요일 계산
    dayOfWeek(dateStr) {
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      const d = new Date(dateStr);
      if (isNaN(d)) return "";
      return days[d.getDay()];
    },

    // 결과 화면용 텍스트 만들기
    formatLabel(type, item) {
      if (type === "place") return item.value || "(미입력)";
      if (type === "date") return item.date ? `${item.date} (${this.dayOfWeek(item.date)})` : "(미입력)";
      return `${item.period} ${item.hour ?? "?"}시 ${item.minute ?? "0"}분`;
    }
  }
};
</script>

<style scoped>
.vote-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 420px;
  margin-left: 30px;
}

/* 투표 덩어리 하나 전체 (장소+날짜+시간 다 포함) */
.vote-block {
  background-color: #fffbe6;
  border: 1px solid #f0e2a0;
  border-radius: 15px;
  padding: 15px;
  color: #5a4800;
}

.vote-title-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #d8c877;
  box-sizing: border-box;
  font-weight: bold;
}

/* 장소/날짜/시간 각 섹션 */
.vote-section {
  margin-bottom: 14px;
}

.section-label {
  margin: 0 0 6px 0;
  color: #4a3b00;
}

.candidate-row {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
}

.text-input {
  flex: 1;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.date-input {
  width: 55px;
  padding: 5px;
  text-align: center;
  border-radius: 6px;
  border: 1px solid #ccc;
}

/* 날짜(달력) 전용 입력칸: 짤리지 않게 넓게 */
.date-picker {
  width: 160px;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  color: #333;
}

.date-picker:not(:valid)::before {
  content: "일정을 선택해주세요";
  color: #aaa;
}

.day-label {
  color: #7a9c3a;
  font-weight: bold;
}

.vote-count {
  margin-left: 5px;
  color: #7a9c3a;
  font-weight: bold;
}

.vote-btn {
  margin-left: auto;
  background-color: #a1d69f;
  border: none;
  border-radius: 8px;
  padding: 5px 10px;
  cursor: pointer;
  color: white;
}

/* 후보 삭제 버튼 */
.delete-btn {
  background-color: #ffffff;
  border: 1px solid #f0a0a0;
  border-radius: 8px;
  padding: 5px 8px;
  cursor: pointer;
  color: rgb(205, 76, 76);
}

.add-btn {
  width: 100%;
  padding: 8px;
  border: 1px dashed #a1d69f;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #5a4800;
}

/* 장소+날짜+시간 통틀어서 투표 종료하는 버튼 */
.end-btn {
  width: 100%;
  padding: 10px;
  border: none;
  background-color: #ff8a5c;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  font-weight: bold;
  margin-top: 4px;
}

.result-section {
  margin-bottom: 14px;
}

.result-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #f0e2a0;
}

/* 새 투표 덩어리(1차/2차 회의 등) 통째로 추가하는 버튼 */
.add-vote-btn {
  width: 100%;
  padding: 12px;
  border: none;
  background-color: #ffd93d;
  border-radius: 10px;
  cursor: pointer;
  color: #4a3b00;
  font-weight: bold;
}
.delete-vote-btn {
  width: 100%;
  padding: 8px;
  border: 1px solid #ff8a5c;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #ff8a5c;
  font-weight: bold;
  margin-top: 6px;
}
</style>
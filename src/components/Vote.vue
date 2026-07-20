<template>
<div class="vote-wrapper">

  <!-- votes 배열에 있는 투표들을 하나씩 화면에 그려줌 -->
  <div v-for="(vote, vIndex) in votes" :key="vIndex" class="vote-box">

    <!-- 투표 제목 입력칸  -->
    <input v-model="vote.title" placeholder="투표 제목 " class="title-input" />

    <!-- 이 투표 안의 후보(날짜) 목록 -->
    <div v-for="(item, cIndex) in vote.candidates" :key="cIndex" class="candidate-row">

      <input v-model.number="item.month" type="number" placeholder="월" class="date-input" />월

      <input v-model.number="item.day" type="number" placeholder="일" class="date-input" />일

      <span class="vote-count">{{ item.votes }}명</span>

      <button @click="toggleVote(item)" class="vote-btn">
        {{ item.voted ? "✅ 취소" : "투표하기" }}
      </button>

    </div>

    <!-- 이 투표 안에 후보(날짜) 추가 -->
    <button @click="addCandidate(vote)" class="add-btn">＋ 후보 추가</button>

  </div>

  <!-- 새 투표 통째로 추가하는 버튼 -->
  <button @click="addVote" class="add-vote-btn">＋ 새 일정투표 추가</button>

</div>
</template>

<script>
export default {
  name: "Vote",

  data() {
    return {
      // 투표들을 담는 배열. 투표 하나당 { title, candidates } 형태
      votes: [
        this.createEmptyVote()
      ]
    };
  },

  methods: {
    // 빈 투표 하나 만들어주는 함수 (후보 1개 포함)
    createEmptyVote() {
      return {
        title: "",
        candidates: [
          { month: null, day: null, votes: 0, voted: false }
        ]
      };
    },

    // "새 일정투표 추가" 버튼 누르면 votes 배열에 빈 투표 하나 추가
    addVote() {
      this.votes.push(this.createEmptyVote());
    },

    // 특정 투표(vote) 안에 후보(날짜) 하나 추가
    addCandidate(vote) {
      vote.candidates.push({ month: null, day: null, votes: 0, voted: false });
    },

    // 투표하기 / 취소
    toggleVote(item) {
      if (item.voted) {
        item.votes--;
        item.voted = false;
      } else {
        item.votes++;
        item.voted = true;
      }
    }
  }
};
</script>

<style scoped>
.vote-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 400px;
}

/* 투표 하나를 담는 박스 */
.vote-box {
  background-color: #fffbe6;
  border: 1px solid #f0e2a0;
  border-radius: 15px;
  padding: 15px;
  color: #5a4800;
}

.title-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #d8c877;
  box-sizing: border-box;
}

.candidate-row {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
}

.date-input {
  width: 45px;
  padding: 5px;
  text-align: center;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.vote-count {
  margin-left: 5px;
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

/* 투표 하나 안에서 후보 추가하는 버튼 */
.add-btn {
  width: 100%;
  padding: 8px;
  border: 1px dashed #a1d69f;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #5a4800;
}

/* 새 투표 통째로 추가하는 버튼 */
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
</style>
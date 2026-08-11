<template>
<div class="vote-wrapper">

  <!-- 일정투표 하나(장소+날짜+시간 다 포함)를 통째로 반복해서 그려줌 -->
  <div v-for="(vote, vIndex) in votes" :key="vIndex" class="vote-block">

    <!-- 이 투표 덩어리의 제목 (예: 1차 회의) -->
    <input v-model="vote.title" 
    @change="saveVotes"
    placeholder="일정 제목" 
    class="vote-title-input" />

    <!-- 투표 진행중일 때: 장소/날짜/시간 후보 다 보여줌 -->
    <div v-if="!vote.ended">

      <div v-for="cat in categoryList" :key="cat.key" class="vote-section">
        <h4 class="section-label">{{ cat.icon }} {{ cat.label }}</h4>

        <div v-for="(item, idx) in vote[cat.key].candidates" :key="idx" class="candidate-row">

          <!-- 장소: 텍스트 입력 -->
          <input v-if="cat.key === 'place'" v-model="item.value" @change="saveVotes" type="text" placeholder="장소" class="text-input" />

          <!-- 날짜: 달력 + 요일 자동 표시 -->
          <template v-else-if="cat.key === 'date'">
            <input v-model="item.date" @change="saveVotes" type="date" class="date-picker" />
           </template>

          <!-- 시간: 오전/오후 + 시 + 분 -->
          <template v-else>
            <select v-model="item.period" @change="saveVotes" class="date-input">
              <option value="오전">오전</option>
              <option value="오후">오후</option>
            </select>
            <input v-model.number="item.hour" @change="saveVotes" type="number" placeholder="시" class="date-input" />시
            <input v-model.number="item.minute" @change="saveVotes" type="number" placeholder="분" class="date-input" />분
          </template>

          <span class="vote-count">{{ item.voters.length }}표</span>
          <!-- 트랜잭션으로 처리하기 위해 item 대신 위치(인덱스)를 넘김 -->
          <button @click="toggleVote(vIndex, cat.key, idx)" class="vote-btn">
            {{ item.voters.includes(myName) ? "✅ 취소" : "투표하기" }}
          </button>

        </div>

        <button @click="addCandidate(vote, cat.key)" class="add-btn">＋ {{ cat.label }} 후보 추가</button>
      </div>

      <!-- 장소/날짜/시간 다 합쳐서 투표종료 버튼 하나만 -->
      <button @click="endVote(vote)" class="end-btn">🛑 투표종료</button>

    </div>

    <!-- 투표 종료 후: 결과만, 표 많은 순서대로 -->
    <div v-else>
      <div v-for="cat in categoryList" :key="cat.key" class="result-section">
        <h4 class="section-label">{{ cat.icon }} {{ cat.label }} 결과</h4>
        <div v-for="(item, idx) in sortedResults(vote, cat.key)" :key="idx" class="result-row">
          <span>{{ formatLabel(cat.key, item) }}</span>
          <span class="vote-count">{{ item.voters.length }}표</span>
        </div>
      </div>
    </div>

    <!-- 이 투표 덩어리 자체를 통째로 삭제 (진행중/종료 상관없이 항상 보임) -->
    <button @click="deleteVote(vIndex)" class="delete-vote-btn">🗑 투표삭제</button>

  </div>

  <!-- 새 일정투표 통째로 추가 (1차 회의, 2차 회의 등) -->
  <button @click="addVote" class="add-vote-btn">＋ 새 일정투표 추가</button>

</div>
</template>

<script>
import { db } from "../firebase";
import { doc, onSnapshot, setDoc, runTransaction } from "firebase/firestore";

export default {
  name: "Vote",

  props:[
    "currentTeam"
  ],

  data() {
    return {
      // 장소/날짜/시간 표시용 정보
      categoryList: [
        { key: "place", label: "장소", icon: "📍" },
        { key: "date", label: "날짜", icon: "📅" },
        { key: "time", label: "시간", icon: "⏰" }
      ],

      votes: [],

      // 지금 이 브라우저를 쓰는 사람 이름 (투표한 사람 구분용)
      myName: "",

      // Firestore 실시간 구독을 껐다 켰다 하기 위해 저장해둠
      unsubscribe: null
    };
  },
  mounted(){
    this.loadMyName();
    this.listenVotes();
  },
  beforeUnmount(){
    // 화면을 벗어날 때 실시간 구독 정리
    if (this.unsubscribe) this.unsubscribe();
  },
  methods: {
    // localStorage에서 내 이름 불러오기, 없으면 입력받기
    loadMyName(){
      let name = localStorage.getItem("myName");
      if (!name) {
        name = window.prompt("이름을 입력해주세요 (팀원 구분용)") || "익명";
        localStorage.setItem("myName", name);
      }
      this.myName = name;
    },

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
    // votes/voted 대신 voters(투표한 사람 이름 목록)로 관리
    createCandidate(type) {
      if (type === "place") return { value: "", voters: [] };
      if (type === "date") return { date: "", voters: [] };
      return { period: "오전", hour: null, minute: null, voters: [] };
    },

    // "새 일정투표 추가" 버튼: votes 배열에 투표 덩어리 하나 추가
    async addVote() {
      this.votes.push(this.createVote());
      await this.saveVotes();
    },

    // 특정 투표 덩어리(vote)의 특정 카테고리(type)에 후보 하나 추가
    async addCandidate(vote, type) {
      vote[type].candidates.push(this.createCandidate(type));
      await this.saveVotes();
    },

    // 투표 덩어리(장소+날짜+시간 통째로) 삭제
    async deleteVote(vIndex) {
      this.votes.splice(vIndex, 1);
      await this.saveVotes();
    },

    // 투표하기 / 취소
    // *** 핵심 수정 부분 ***
    // 내 화면에 있던 낡은 데이터를 통째로 저장하는 게 아니라,
    // 트랜잭션 안에서 Firestore의 "가장 최신 데이터"를 다시 읽어온 다음
    // 그 위에 내 투표(voters)만 추가/삭제하고 다시 저장함
    // -> 친구가 나보다 먼저 투표해놨어도 그 표가 사라지지 않음
    async toggleVote(vIndex, catKey, idx) {
      const ref = doc(db, "teams", this.currentTeam, "votes", "data");

      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(ref);
        if (!snap.exists()) return;

        const latestVotes = snap.data().votes;
        const candidate = latestVotes[vIndex][catKey].candidates[idx];

        const i = candidate.voters.indexOf(this.myName);
        if (i === -1) {
          candidate.voters.push(this.myName);
        } else {
          candidate.voters.splice(i, 1);
        }

        transaction.set(ref, { votes: latestVotes });
      });
      // 화면 갱신은 listenVotes()의 실시간 구독이 자동으로 해줌
    },

    // 표 많은 순서대로 정렬한 결과 반환
    sortedResults(vote, type) {
      return [...vote[type].candidates].sort((a, b) => b.voters.length - a.voters.length);
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
    },

    // *** 추가된 부분 ***
    // 한 번만 불러오는 getDoc 대신, 실시간으로 계속 지켜보는 onSnapshot 사용
    // -> 친구가 투표하면 내 화면도 자동으로 바로 업데이트됨
    listenVotes(){
      const ref = doc(
        db,
        "teams",
        this.currentTeam,
        "votes",
        "data"
      );

      this.unsubscribe = onSnapshot(ref, (snap) => {
        if (snap.exists()) {
          this.votes = snap.data().votes;
        } else {
          this.votes = [this.createVote()];
          this.saveVotes();
        }
      });
    },

    async saveVotes(){
      const ref = doc(
        db,
        "teams",
        this.currentTeam,
        "votes",
        "data"
      );
      await setDoc(ref,{
        votes:this.votes
      });
    },
    async endVote(vote){
      vote.ended = true;
      await this.saveVotes();
    },
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
<template>

<div class="schedule-layout">

    <!-- 왼쪽: 일정 조율 카드 -->
    <div class="form-side">
        <ScheduleForm 
        @add-schedule="addSchedule"
        />
    </div>

    <!-- 오른쪽: 등록된 일정 목록 -->
    <div class="list-side">

        <div class="schedule-list">
    
            <div
            class="schedule-item"
            v-for="schedule in schedules"
            :key="schedule.id"
            >

             <button 
        class="delete-btn"
        @click="deleteSchedule(schedule.id)"
        >
        ×
        </button>

        <h3>
            📌 {{schedule.title}}
        </h3>

        <div class="schedule-info">

            <span class="info-chip">
                📆 {{schedule.date}}
            </span>

            <span class="info-chip">
                ⏰ {{schedule.time}}
            </span>

            <span class="info-chip">
                📍 {{schedule.place || "장소 미지정"}}
            </span>

        </div>   

            </div>

        </div>

    </div>

</div>

</template>

<script>

import ScheduleForm from "./ScheduleForm.vue"


export default {
emits:[
    "add-schedule",
    "delete-schedule"
],

props:[
    "schedules"
],

methods:{

addSchedule(schedule){
    this.$emit(
        "add-schedule", {
            id: Date.now(),
            ...schedule
        }
    );

},
deleteSchedule(id){

    const result = confirm(
        "일정을 삭제하시겠습니끼?"
    );

    if(!result){
        return;
    }

    this.$emit(
        "delete-schedule", id
    );
}    

},

components:{
    ScheduleForm
}

}

</script>

<style scoped>

.schedule-layout{
    display:flex;
    align-items:flex-start;
    justify-content:center;
    gap:40px;
    padding:20px;
}

.form-side{
    flex-shrink:0;
}

.list-side{
    flex-grow:1;
    max-width:600px;
}

.schedule-list{
    display:flex;
    flex-direction:column;
    gap:20px;
    align-items:stretch;
    max-height:70vh;
    overflow-y:auto;
    padding-right:8px;
}

.schedule-item {
    width:100%;
    box-sizing:border-box;
    background:white;
    padding:20px 24px;
    border-radius:14px;
    border:1px solid #f0f0f0;
    border-left:5px solid #F48FB1;
    box-shadow:
    0 3px 10px rgba(0,0,0,0.06);
    position:relative;
    transition:0.2s;
}

.schedule-item:hover {
    transform:translateY(-2px);
    box-shadow:
    0 6px 15px rgba(0,0,0,0.1);
}

.schedule-item h3 {
    margin:0 0 12px;
    padding-right:30px;
    color:#333;
    font-size:18px;
    word-break:break-word;
}

.schedule-info {
    display:flex;
    flex-wrap:wrap;
    justify-content:space-between;
    gap:8px;
}

.info-chip {
    display:inline-block;
    background:#FDE2EA;
    color:#9c3b5e;
    font-size:13px;
    font-weight:600;
    padding:5px 12px;
    border-radius:20px;
    white-space:nowrap;
}

.delete-btn {
    position:absolute;
    top:14px;
    right:14px;
    width:24px;
    height:24px;
    border-radius:50%;
    border:none;
    background:#f5f5f5;
    color:#999;
    font-size:15px;
    line-height:1;
    cursor:pointer;
}

.delete-btn:hover {
    background:#ffd6d6;
    color:#c00;
}
</style>
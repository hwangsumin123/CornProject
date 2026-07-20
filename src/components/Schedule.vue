<template>

<div>

<!--ScheduleForm에서 add-schedule 보내면
Schedule.vue의 addSchedule 함수 실행-->
<ScheduleForm 
@add-schedule="addSchedule"
/>

<!-- 등록된 일정 표시 -->
    <!-- 등록된 일정 목록 -->

<div class="schedule-list">
    
    <div
    class="schedule-item"
    v-for="schedule in schedules"
    :key="schedule.id"
    >

        <h3>
            📌 {{schedule.title}}
        </h3>


        <div class="schedule-info">

            <p>
                📆 {{schedule.date}}
            </p>


            <p>
                ⏰ {{schedule.time}}
            </p>


            <p>
                📍 {{schedule.place || "장소 미지정"}}
            </p>

            <button 
            class="delete-btn"
            @click="deleteSchedule(schedule.id)"
            >
            ×
            </button>

        </div>

    </div>

</div>


</div>

</template>

<script>

import ScheduleForm from "./ScheduleForm.vue"


export default {
emits:[
    "add-schedule"
],

data(){
    return{
        schedules:[]
    }
},

methods:{

addSchedule(schedule){

    this.schedules.push({
        id: Date.now(),
        title:schedule.title,
        date:schedule.date,
        time:schedule.time,
        place:schedule.place

    });

    this.$emit(
        "add-schedule", schedule
    );

},
deleteSchedule(id){

    const result = confirm(
        "일정을 삭제하시겠습니끼?"
    );

    if(!result){
        return;
    }

    this.schedules = 
    this.schedules.filter(
        schedule => schedule.id !==id
    );
}    

},

components:{
    ScheduleForm
}

}

</script>

<style scoped>

.schedule-list{
    margin-top:40px;
    display:flex;
    flex-direction:column;
    gap:20px;
    align-items:center;
}

.schedule-item {
    width:450px;
    background:white;
    padding:25px;
    border-radius:14px;
    border:1px solid #eee;
    box-shadow:
    0 3px 10px rgba(0,0,0,0.08);
    position:relative;
    transition:0.2s;
}

.schedule-item:hover {
    transform:translateY(-3px);
    box-shadow:
    0 6px 15px rgba(0,0,0,0.12);
}

.schedule-item h3 {
    margin:0 0 20px;
    color:#5a4800;
    font-size:20px;
}

.schedule-info p {
    margin:8px 0;
    color:#555;
    font-size:15px;
}

.delete-btn {
    position:absolute;
    top:15px;
    right:15px;
    width:28px;
    height:28px;
    border-radius:50%;
    border:none;
    background:#f5f5f5;
    color:#777;
    font-size:18px;
    cursor:pointer;
}

.delete-btn:hover {
    background:#ffd6d6;
    color:#c00;
}
</style>
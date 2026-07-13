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
            🌽 {{schedule.title}}
        </h3>


        <div class="schedule-info">

            <p>
                📆 {{schedule.date}}
            </p>


            <p>
                ⏰ {{schedule.time}}
            </p>


            <p>
                📍 {{schedule.place}}
            </p>

        </div>


    </div>


</div>


</div>

</template>

<script>

import ScheduleForm from "./ScheduleForm.vue"


export default {

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



.schedule-item{


    width:450px;


    background:white;


    padding:25px;


    border-radius:20px;


    box-shadow:

    0 8px 20px rgba(0,0,0,0.12);


    border-left:10px solid #F4B400;


}



.schedule-item h3{


    margin:0 0 20px 0;


    color:#5a4800;


}



.schedule-info p{


    margin:10px 0;


    color:#665200;


    font-size:15px;


}

</style>
<template>

<div class="schedule-card">

    <h2>📅 일정 조율</h2>

    <div class="form-item">

        <label>일정 제목</label>

        <input
        v-model="title"
        placeholder="예) 팀 회의"
        />

    </div>

    <div class="form-item">

        <label>날짜</label>

        <input
        type="date"
        v-model="date"
        />

    </div>

    <div class="form-item">

        <label>시간</label>

        <input
        type="time"
        v-model="time"
        />

    </div>

    <div class="form-item">

        <label>장소</label>

        <input
        v-model="place"
        placeholder="예) 학교 앞 카페"
        />

    </div>

    <button @click="addSchedule">
        일정 등록
    </button>

</div>

</template>

<script>

export default {

data(){

    return{

        title:"",
        date:"",
        time:"",
        place:""

    }

},

methods:{

    addSchedule(){
        if(!this.title){
        alert(
        "일정 제목을 입력해주세요."
        );

        return;
        }

        if(!this.date){
        alert(
        "날짜를 입력해주세요."
        );
        
        return;
        }

        if(!this.time){
        alert(
        "시간을 입력해주세요."
        );
        
        return;
        }

        const schedule = {

            title:this.title,
            date:this.date,
            time:this.time,
            place:this.place

        };

        this.$emit(
        "add-schedule",
        schedule
        );

        alert("일정 등록 완료");

        this.title="";
        this.date="";
        this.time="";
        this.place="";

    }

}

}
</script>

<style scoped>

.schedule-card{
    width:450px;
    padding:35px;
    background:#FFF2A8;
    border-radius:20px;
    box-shadow:
    0 8px 20px rgba(0,0,0,0.15);
    margin: auto;
}

h2{
    text-align:center;
    color:#5a4800;
    margin-bottom:30px;
}

.form-item{
    display:flex;
    flex-direction:column;
    margin-bottom:20px;
}

label{
    font-weight:bold;
    margin-bottom:8px;
    color:#665200;
}

input{
    height:45px;
    border:none;
    border-radius:10px;
    padding:0 15px;
    font-size:15px;
    background:white;
}

input:focus{
    outline:2px solid #F4C430;
}

button{
    width:100%;
    height:45px;
    margin-top:10px;
    border:none;
    border-radius:12px;
    background:#F4B400;
    color:white;
    font-size:16px;
    font-weight:bold;
    cursor:pointer;
}

button:hover{
    background:#D99C00;
}
</style>
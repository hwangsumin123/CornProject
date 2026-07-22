<template>

<div class="dm-container">

    <!-- 왼쪽 팀원 목록 -->
    <div class="member-list">
        <h3>DM</h3>

        <div v-for="member in members"
        :key="member"
        class="member"
        @click="selectMember(member)">
            👤 {{member}}
        </div>
    </div>

    <!-- 오른쪽 채팅 영역 -->
    <div class="chat-area">

        <div class="chat-header">

            <span v-if="selectedMember">
                {{selectedMember}}님과 대화
            </span>

            <span v-else>
                대화할 팀원을 선택하세요
            </span>

        </div>

        <div 
        class="messages"
        ref="messagesBox">
            <div
            v-for="msg in currentMessages"
            :key="msg.id"
            class="message my">
                {{msg.text}}
            </div>
        </div>

        <div class="input-area">
            <input v-model="message"
            :disabled="!selectedMember"
            @keyup.enter="sendMessage"
            placeholder="메시지를 입력하세요" />

            <button @click="sendMessage"
            :disabled="!selectedMember">
                전송
            </button>
        </div>
    </div>

</div>

</template>

<script>

export default {
    props:[
        "members",
        "messages"
    ],

    data(){
        return{
            message:"",
            selectedMember:null
        }
    },

    methods:{
        sendMessage(){
            if(!this.message){
                return;
            }
            this.$emit(
                "send-message",
                {
                    receiver:this.selectedMember,
                    text:this.message
                }
            );
            this.message="";
        },
        selectMember(member){
            this.selectedMember=member;
        }
    },

    computed:{
        currentMessages(){
            if(!this.selectedMember){
                return [];
            }

            return this.messages[this.selectedMember] || [];
        }
    }
}

</script>

<style scoped>

.dm-container{
    display:flex;
    height:600px;
    background:white;
    border-radius:20px;
    overflow:hidden;
}
.member-list{
    width:220px;
    border-right:1px solid #eee;
    padding:20px;
    background:#fff8d6;
}
.member-list h3{
    margin-bottom:20px;
    color:#5a4800;
}
.member{
    padding:12px;
    margin-bottom:10px;
    border-radius:12px;
    cursor:pointer;
    color:#665200;
}
.member:hover{
    background:#ffe98a;
}
.chat-header{
    padding:20px;
    border-bottom:1px solid #eee;
    font-weight:bold;
    color:#5a4800;
}
.chat-area{
    flex:1;
    display:flex;
    flex-direction:column;
    height:600px;
    overflow:hidden;
}
.messages{
    flex:1;
    min-height:0;
    overflow-y:auto;
    padding:25px;
    display:flex;
    flex-direction:column;
    gap:20px;
}
.message{
    max-width:60%;
    padding:14px 18px;
    border-radius:18px;
    line-height:1.5;
    margin-bottom:5px;
}
.my{
    align-self:flex-end;
    background:#fff4c2;
    color:#5a4800;
    border-bottom-right-radius:5px;
}
.input-area{
    height:75px;
    display:flex;
    align-items:center;
    gap:12px;
    padding:15px 20px;
    border-top:1px solid #eee;
    background:white;
    flex-shrink:0;
}
.input-area input{
    flex:1;
    height:45px;
    border:none;
    background:#f7f7f7;
    border-radius:25px;
    padding:0 20px;
    font-size:15px;
}
.input-area input:focus{
    outline:2px solid #F4C430;
}
.input-area button{
    width:85px;
    height:45px;
    border:none;
    border-radius:25px;
    background:#F4B400;
    color:white;
    font-weight:bold;
    cursor:pointer;
}
.input-area button:hover{
    background:#D99C00;
}

</style>
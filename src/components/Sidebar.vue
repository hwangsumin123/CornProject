<template>

<div class="sidebar">

    <h2>MENU</h2>

    <button
        v-for="item in menuItems"
        :key="item.id"
        :class="{ active: selectedMenu === item.id }"
        @click="selectMenu(item.id)"
    >
        {{ item.label }}
    </button>

</div>

</template>


<script>

export default {

data(){

    return{

        // 사이드바 메뉴 목록
        menuItems:[
            { id:"schedule", label:"일정 조율" },
            { id:"vote", label:"투표" },
            { id:"dm", label:"DM" }
        ],

        // 지금 선택된(눌린) 메뉴 id
        selectedMenu:null

    }

},

methods:{

    // 버튼 누르면 selectedMenu 값 바꿔줌 -> active 클래스 붙어서 글씨 커짐
    selectMenu(id){

        this.selectedMenu = id;

    }

}

}

</script>


<style scoped>

.sidebar {

    width:200px;
    background-color:#fffbe6;
    padding:20px;

    display:flex;
    flex-direction:column;
    gap:15px;

    border-right:3px solid #ffd93d;

}

.sidebar h2 {

    margin:0 0 10px 0;
    font-size:18px;
    color:#2e7d32;
    letter-spacing:1px;
    text-align:center;

}

.sidebar button {

    padding:10px;
    cursor:pointer;
    text-align:center;

    border:2px solid #ffd93d;
    border-radius:8px;
    background-color:#ffe066;
    box-shadow:0 1px 3px rgba(0,0,0,0.1);

    font-size:14px;
    font-weight:500;
    color:#4a3b00;

    transform:scale(1);
    transform-origin:center;

    transition:transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;

}

/* 마우스 올렸을 때 */
.sidebar button:hover {

    background-color:#ffd93d;
    transform:scale(1.08)

}

/* 버튼 눌러서 선택된 상태 -> 버튼 자체가 커지고 초록색으로 강조 */
.sidebar button.active {

    background-color:#4caf50;
    color:#ffffff;
    border-color:#2e7d32;

    transform:scale(1.15);

    box-shadow:0 4px 10px rgba(76,175,80,0.4);

}


</style>
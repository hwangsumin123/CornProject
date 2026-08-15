<template>

<div class="sidebar">

    <button class="home-btn" :class="{ active: selectedMenu === null }" @click="selectMenu(null)">🏠 </button>
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
            { id:"schedule", label:"일정 등록" },
            { id:"vote", label:"일정 투표" },
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
        this.$emit("menu-select", id);   

    }

}

}

</script>

<style scoped>

.sidebar {

    width:200px;
    background-color:#7cc576;
    padding:20px;

    display:flex;
    flex-direction:column;
    gap:12px;

    border-right:none;
    box-shadow:2px 0 8px rgba(0,0,0,0.08);

    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    overflow-y: auto;

}

.sidebar h2 {

    margin:0 0 15px 0;
    font-size:16px;
    font-weight:800;
    color:#ffffff;
    letter-spacing:3px;
    text-align:center;
    text-shadow:0 1px 2px rgba(0,0,0,0.15);

}

.sidebar button {

    padding:12px;
    cursor:pointer;
    text-align:center;

    border:none;
    border-radius:10px;
    background-color:#ffffff;
    box-shadow:0 2px 5px rgba(0,0,0,0.15);

    font-size:14px;
    font-weight:700;
    color:#2e7d32;

    transform:scale(1);
    transform-origin:center;

    transition:transform 0.15s ease, background-color 0.2s ease, box-shadow 0.2s ease;

}

/* 마우스 올렸을 때 */
.sidebar button:hover {

    background-color:#e8f5e9;
    transform:scale(1.06)

}

/* 버튼 눌러서 선택된 상태 -> 버튼 자체가 강조 */
.sidebar button.active {

    background-color:#fff3c4;
    color:#7a5c00;

    transform:scale(1.1);

    box-shadow:0 4px 14px rgba(0,0,0,0.2);

}
/*홈버튼스타일*/
.sidebar .home-btn {

    border:none;
    background-color:#ffffff;
    border-radius:10px;
    cursor:pointer;

    width:64px;
    padding:12px 0;
    font-size:26px;
    line-height:1;

    align-self:center;
    margin-bottom:5px;

    transform:scale(1);
    transition:transform 0.2s ease, background-color 0.2s ease;

}

.sidebar .home-btn:hover {
    background-color:#e8f5e9;
    transform:scale(1.1);
}

.sidebar .home-btn.active {
    background-color:#fff3c4;
    box-shadow:none;
    transform:scale(1.1);
}

</style>
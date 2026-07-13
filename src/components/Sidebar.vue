<template>

<div class="sidebar">

    <h2>메뉴</h2>

    <button>
        일정 조율
    </button>

    <button>
        투표
    </button>

    <button>
        DM
    </button>

</div>

</template>


<script>

export default {

}

</script>


<style scoped>

.sidebar {

    width:200px;
    background-color:#f4f4f4;
    padding:20px;

    display:flex;
    flex-direction:column;
    gap:15px;

    border-right:1px solid #ddd;

}


.sidebar button {

    padding:10px;
    cursor:pointer;

}

</style>
<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
    perOption :{
        type: Array,
        default: () => [10,20,30,50]
    },
    perCnt : {
        type: Number,
        default: (props) => props.perOption[0]
    },
    perVerticalLine : {
        type: String,
        default: "between"
    },
    pageRange:{
        type: Number,
        default: 5
    },
    rowItems: {
        type: Array,
        default: () => []
    }
})

const rows = ref([...props.rowItems]);

const perNum = ref(0);//보여줄 row 수
const totalCnt = ref(props.rowItems.length);//총 row 수
const totalPage = ref(0);//총 페이지 수
const currPage = ref(1);// 현재 페이지 수
const pageNum = ref([]);//페이지 버튼 생성


const pageFirstNum = ref(0);//페이지네이션 첫번째 숫자


const onBtn = ref(false);

const totalPageNum = computed({
    get: () => {
        totalPage.value = Math.ceil(totalCnt.value / perNum.value);
    }
})

const firstNum = computed({
    get: () => {
        pageFirstNum.value = (currPage.value - 1) * props.pageRange;
    }
})

const pageNumArr = computed({
    get: () => {
        let num = Array(totalPageNum.value).fill().map((_, i) => i);
        pageNum.value = num.slice(firstNum.value, firstNum.value - 1);
    }
})

console.log("pagNumArr::", totalPageNum.value);

function setPerNum(e){
    perNum.value = e.target.currentValue;
}

function moveFirstPage(){
    currPage.value = 1;
}

function movePrevPage(){
    currPage.value = currPage.value - 1;
}

function moveNextPage(){
    currPage.value = currPage.value + 1;
}

function moveLastPage(){
    currPage.value = totalPageNum;
}

function clickPageNum(e){
    currPage.value = e.target.nextSibling.innerText;
    if(e.target.nextSibling.innerText === currPage.value){
        onBtn.value = true;
    }

    let lastNum = (currPage * perNum) + ((currPage* perNum) + (perNum - 1));
    rows.slice((currPage* perNum),  lastNum);
}

watch([rows, () => props.rowItems],( [newItems, newRows] ) => {
    rows.value = newItems;
})

</script>

<template>
    <nav class="wrap_pagination" :class="perVerticalLine">
        <div class="box_pagination">
            <button type="button" @click="moveFirstPage">&lt;</button>
            <button type="button" @click="movePrevPage">&lt;&lt;</button>
            <ul class="pagination">
                <li v-for="num in pageNumArr" 
                    key="page{{ num }}" 
                    @click="clickPageNum($event)"
                    :class="{ on : onBtn }"
                >
                    <a href="">{{num}}</a>
                </li>
            </ul>
            <button type="button" @click="moveNextPage">&gt;</button>
            <button type="button" @click="moveLastPage">&gt;&gt;</button>
        </div>
        <div>
            <select name="paginationPer" id="" class="per_selectbox" @change="setPerNum($event)">
                <option v-for="num in perOption" value="{{num}}" key="per{{num}}">{{num}}</option>
            </select>
        </div>
    </nav>
</template>

<style>
.wrap_pagination{
    display: flex;
    align-items: center;
    margin-top: 20px;
    gap: 20px;
}
.wrap_pagination.between{
    justify-content: space-between;
}
.wrap_pagination.left{
    justify-content: left;
    gap: 20px;
}
.wrap_pagination.center{
    justify-content: center;
    gap: 20px;
}
.wrap_pagination.right{
    justify-content: right;
    gap: 20px;
}
.box_pagination{
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
}
.box_pagination :where(button,  .pagination li){
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    border: 1px solid black;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: #fff;
    cursor: pointer;
}
.box_pagination :where(button,  .pagination li):hover{
    background: black;
    color: #fff;
}
.pagination{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
}
.pagination li.on{
    background: black;
}
.pagination a{
    text-decoration: none;
}
.per_selectbox{
    width: 108px;
    height: 32px;
    border-radius: 4px;
}
</style>
<script setup>
import { ref, watch } from 'vue';
import Header from '@/components/Header.vue';
import Table from '@/components/Table.vue';
import SearchBar from '@/components/SearchBar.vue';
import { fields, columns, rows } from '@/asset/dummyData.js';
import Modal from '@/components/Modal.vue';


const SESSION_KEY = "rows.data"
function loadData(){
  const row = sessionStorage.getItem(SESSION_KEY);

  if(row) return JSON.parse(row);

  return structuredClone(rows)
}

let id = 0;

const tbId = "testTable";

const title = "Dashboard";
const menuItem = [
  {
    id: id++,
    title: "Dashboard",
    src: "/dashboard"
  }
]

const originRows = ref(loadData());
const tempRows = ref(originRows.value);

const inputText = ref("");

const isOpen = ref(false);


function changeInput(val){
  inputText.value = val.value;
}

function filteringData(){
  const searchRow = originRows.value.filter( item => item.Name === inputText.value);

  console.log(tempRows.value);
  if(tempRows.value.length <= 0){
    isOpen.value = true;
    tempRows.value = [...originRows.value];
    return;
  }

  tempRows.value = [...searchRow]
}

watch(tempRows, (newVal) => {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(newVal));
  originRows.value = [...newVal];
})


</script>

<template>
  <div>
    <Header :title="title" :menuItem="menuItem" />
    <div>
      <SearchBar @clickSearch="filteringData" @changeValue="changeInput"/>
      <div>
        <Table 
          :gridId="tbId" 
          :columnItems="columns" 
          :fields="fields" 
          v-model:rowItems="tempRows"
          className="dashboard_tb" />
      </div>
    </div>
  </div>
  <Modal v-model:isOpen="isOpen" title="해당 검색어가 없습니다."/>
</template>

<style>
.dashboard_tb{
  height: 500px;
}

</style>
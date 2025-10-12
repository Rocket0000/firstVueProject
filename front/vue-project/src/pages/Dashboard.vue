<script setup>
import { ref, watch } from 'vue';
import Header from '@/components/Header.vue';
import Table from '@/components/Table.vue';
import SearchBar from '@/components/SearchBar.vue';
import { fields, columns, rows } from '@/asset/dummyData.js';
import Modal from '@/components/Modal.vue';

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

let gridView = null;
let provider = null;

const row_copy = ref(rows);
const tempRows = ref([...rows]);

const inputText = ref("");

const isOpen = ref(false);


function changeInput(val){
  inputText.value = val.value;
}

function getRealGridFnc(p, v){
  provider = p;
  gridView = v;
}

function filteringData(){
  tempRows.value = row_copy.value.filter( item => item.Name === inputText.value);


  if(tempRows.value.length === 0){
    isOpen.value = true;
    tempRows.value = [...rows];
    return;
  }
}

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
          :rowItems="tempRows"
          @gridData="getRealGridFnc" 
          className="dashboard_tb" />
      </div>
    </div>
  </div>
  <Modal v-model="isOpen" title="해당 검색어가 없습니다."/>
</template>

<style>
.dashboard_tb{
  height: 500px;
}

</style>
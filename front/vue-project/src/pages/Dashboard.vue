<script setup>
import { ref, watch } from 'vue';
import { fields, columns, rows } from '@/asset/dummyData.js';
import { fields as subFields, columns as subColumns } from '@/asset/dummySubData';
import Header from '@/components/Header.vue';
import Table from '@/components/Table.vue';
import SearchBar from '@/components/SearchBar.vue';
import Modal from '@/components/Modal.vue';
/** 할일 검색 기능 확인 및 삭제기능 하기 */


//세션 지우고 api 호출해야함
const SESSION_KEY = "rows.data";
const COPY_SESSION_KEY = "rows.copy";

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




const modalProps = {
  title:"",
  modalType: "tb",
  isOpen: false,
  fnc: openTbModal,
  tbProps: {
    gridId: "subTb",
    fields: subFields,
    columnItems: subColumns,
    rowItems : [],
    isAdding: false,
    isDeleting: false,
    isSaving: false,
  }
}

function openTbModal(grid, idx, props ,state){
  let modalData = grid.getValues(idx.itemIndex);

  props.tbProps.rowItems.push(grid.getValues(idx.itemIndex))

  props.title = modalData.FullName;
  state.value = true;
  return true;
}

function changeInput(val){
  inputText.value = val.value;
}

function filteringData(){
  const searchValues = originRows.value.filter( item => item.Name === inputText.value);

  if(inputText?.value === ""){
    tempRows.value = [...originRows.value];
    return;
  }

  if(searchValues?.length === 0){
    isOpen.value = true;
    tempRows.value = [...originRows.value];
  }else{
    isOpen.value = false;
    tempRows.value = searchValues;
  }
}



watch([tempRows], ([newVal, oldVal]) => {
  //세션 지우고 api 호출해야함
  sessionStorage.setItem(COPY_SESSION_KEY, JSON.stringify(newVal));
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
          v-model:row-items="tempRows"
          :m-props="modalProps"
          className="dashboard_tb" />
      </div>
    </div>
  </div>
  <Modal v-model:is-open="isOpen" title="해당 검색어가 없습니다."/>
</template>

<style>
.dashboard_tb{
  height: 500px;
}

</style>
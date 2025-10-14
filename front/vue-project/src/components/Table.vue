<script setup>
import { onMounted, defineEmits, watch, ref, computed } from "vue";
import { GridView, LocalDataProvider } from "realgrid";
import key from "/public/realGridLicenseKey.js";

  const props = defineProps({ 
    gridId: String,
    gridRoot: {
      type: String,
      default: "/"
    },
    columnItems: Array,
    rowItems: Array,
    className: String,
    fields: Array,
    isAdding : {
      type: Boolean,
      default: true
    },
    isDeleting: {
      type: Boolean,
      default: true
    },
    isSaving: {
      type: Boolean,
      default: true
    },

  })

  let gridView = null;
  let dataProvider = null;

  // const emit = defineEmits(["data"], []);

  const addRowData = ref([]);

  const settingData = ref([]);

  onMounted(() => {
    key;
  })

  onMounted(() => {
    dataProvider = new LocalDataProvider(false);
    gridView = new GridView(props.gridId);

    gridView.setDataSource(dataProvider);
    dataProvider.setFields(props.fields);
    gridView.setColumns(props.columnItems);
    dataProvider.setRows(props.rowItems);

    gridView.setEditOptions({
      insertable: true,
      appendable: true,
      updatable : true
    });
  })

  watch([() => props.fields, () => props.columnItems, () => props.rowItems], ([newField, newCol, newRow ]) => {
    dataProvider.setFields(newField);
    gridView.setColumns(newCol);
    dataProvider.setRows(newRow);
  })

  //추가 기능
  function addRows(){
    let row = gridView.getCurrent().dataRow;
    dataProvider.insertRow(Math.max(0, row), {});
  }

  const setData = computed({
    get(){
      return props.rowItems
    },
    set(){

    }
  }) 

  function saveRows(){
    let allData = dataProvider.getRows();

    settingData.value = allData.map((item, idx) => ({
        _idx: idx,
        data : [...item[idx]]
    }))
    console.log(dataProvider);

    // let newRowsIdx = dataProvider.getStateRows("created");
    // let updateRowsIdx = copyData.filter( (data, idx)=> JSON.stringify(data) !== JSON.stringify(allData[idx]))
    
    // let datas = copyData.map( data => ) 

    // dataProvider.updateRows(curr.dataRow, datas, 0);
    
    
  }

  

  //삭제 기능
  function deleteRows(){
    let isCheckedRows = gridView.getCheckedRows(true, false);
    dataProvider.removeRows(isCheckedRows);
  }

</script>


<template>
  <div class="btn_box">
    <button type="button" v-if="isAdding" @click="addRows">추가</button>
    <button type="button" v-if="isSaving" @click="saveRows">저장</button>
    <button type="button" v-if="isDeleting" @click="deleteRows">삭제</button>
  </div>
  <div :id="gridId" :class="className"></div>
</template>

<style>
  .btn_box{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 5px;
    margin-bottom: 20px;
  }
</style>
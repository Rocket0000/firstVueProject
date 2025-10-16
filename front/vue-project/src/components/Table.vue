<script setup>
import { onMounted, defineEmits, watch, ref } from "vue";
import key from "/public/realGridLicenseKey.js";
import { GridView, LocalDataProvider } from "realgrid";
import Modal from "./Modal.vue";



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
    mProps: Object
  })
  const modalProps = {...props.mProps};
  const open = ref(modalProps.isOpen);

  let gridView = null;
  let dataProvider = null;

  const emit = defineEmits(["update:rowItems"]);

  const settingData = ref([...props.rowItems]);

  onMounted(() => {
    key
  })

  onMounted(() => {
    dataProvider = new LocalDataProvider(false);
    gridView = new GridView(props.gridId);

    gridView.setDataSource(dataProvider);
    dataProvider.setFields(props.fields);
    gridView.setColumns(props.columnItems);
    dataProvider.setRows(props.rowItems);

    gridView.displayOptions.emptyMessage = "표시할 데이터 없습니다.";
    
    gridView.setEditOptions({
      insertable: true,
      appendable: true,
      updatable : true
    });

    openModalDetail();
  });

  watch([() => props.fields, () => props.columnItems, () => props.rowItems], ([newField, newCol, newRow ]) => {
    dataProvider.setFields(newField);
    gridView.setColumns(newCol);
    dataProvider.setRows([...newRow]);
  })


  //추가 기능
  function addRows(){
    let row = gridView.getCurrent().dataRow;
    dataProvider.insertRow(Math.max(0, row), {});
  }

  function saveRows(){
    gridView.commit(true);

    let allData = dataProvider.getRows();

    settingData.value = allData.map((_, idx) => gridView.getValues(idx));

    emit("update:rowItems", settingData.value);    
    //api 호출시 지움
    sessionStorage.setItem("rows.data", JSON.stringify(settingData.value));
  }

  //삭제 기능
  function deleteRows(){
    let checkedRowIdx = gridView.getCheckedRows(true, false);
    let checkedRows = checkedRowIdx.map( row => gridView.getValues(row));

    settingData.value = settingData.value.filter(obj => !checkedRows.some( obj2 => obj.__rowId == obj2.__rowId));
    
    dataProvider.removeRows(checkedRowIdx);
    //api 호출시 지움
    emit("update:rowItems", settingData.value);  
    sessionStorage.setItem("rows.data", JSON.stringify(settingData.value));
  }

  //grid내 버튼 click
  function openModalDetail(){
    gridView.onCellItemClicked = function (grid, idx) {
      let modalData = grid.getValues(idx.itemIndex);

      //따로 어떻게 처리 할지
      if(modalProps && modalProps.modalType === "tb"){
        let settingRows = modalProps.tbProps.rowItems.push(grid.getValues(idx.itemIndex));
        console.log(settingRows)
      }

      modalProps.title = modalData.FullName;
      open.value = true;

      
      return true;
    }
  }

</script>


<template>
  <div class="btn_box">
    <button type="button" v-if="isAdding" @click="addRows">추가</button>
    <button type="button" v-if="isSaving" @click="saveRows">저장</button>
    <button type="button" v-if="isDeleting" @click="deleteRows">삭제</button>
  </div>
  <div :id="gridId" :class="className"></div>
  <Modal v-bind="modalProps" v-model:is-open="open" />
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
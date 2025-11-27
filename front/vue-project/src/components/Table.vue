<script setup>
import { onMounted, defineEmits, watch, ref, nextTick } from "vue";
import key from "/public/realGridLicenseKey.js";
import { GridView, LocalDataProvider, ColumnHeaderItemLocation } from "realgrid";
import Modal from "./Modal.vue";
import Pagination from "./Pagination.vue";



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
    cellClickFnc: Array,
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
    useModal : {
      type: Boolean,
      default: true
    },
    pageStatusBar : {
      type: Object,
      default: () => {
        return {
          useable : false,
          align : "left"
        }
      }
    },
    usePagination : {
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

  const totalRowCnt = ref(0);
  const currPage = ref(0);
  const totalPage = ref(0);

  onMounted(() => {
    key
    dataProvider = new LocalDataProvider(false);
    gridView = new GridView(props.gridId);
  
    gridView.setDataSource(dataProvider);
    dataProvider.setFields(props.fields);
    gridView.setColumns(props.columnItems);
    gridView.setDisplayOptions({
        showEmptyMessage: true,
        emptyMessage :"표시할 데이터 없습니다.",
        refreshMode : "All"
    });
    gridView.setEditOptions({
      insertable: true,
      appendable: true,
      updatable : true
    });
    gridView.checkBar.headThreeStates = true;
    gridView.checkBar.syncHeadCheck = true;
    dataProvider.setRows(props.rowItems);
    isCellClicked();
  });

  //추가 기능
  function addRows(){
    const cols = gridView.getColumns();
    let row = gridView.getCurrent().dataRow;
    let typeColumns = cols.filter(col => col.renderer);

    let fields = {}; 

    if(typeColumns.length > 0){
      fields = typeColumns.reduce((acc, cur) => {
                  acc[cur.fieldName] = cur.header.text;
                  return acc;
                }, {});
    }

    dataProvider.insertRow(Math.max(0, row), fields);
  }

  function saveRows(){
    let allData = dataProvider.getRows();
    settingData.value = allData.map((_, idx) => gridView.getValues(idx));
    emit("update:rowItems", settingData.value);
    //api 호출시 지움
    sessionStorage.setItem("rows.data", JSON.stringify(settingData.value));
    gridView.commit(true);
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

  function isCellClicked(){
    gridView.onCellItemClicked = function (grid, idx, itemData) {
      if (typeof modalProps.fnc === 'function' && modalProps.fnc) {
        modalProps.fnc(grid, idx, modalProps, open)
      }
    }
  }

  watch([() => props.fields, () => props.columnItems, () => props.rowItems], ([newField, newCol, newRow]) => {
    dataProvider?.setFields(newField);
    gridView?.setColumns(newCol);
    dataProvider?.setRows([...newRow]);
    settingData.value = newRow;
  },{immediate: true, deep: true})

</script>


<template>
  <div class="btn_box">
    <button type="button" v-if="isAdding" @click="addRows">추가</button>
    <button type="button" v-if="isSaving" @click="saveRows">저장</button>
    <button type="button" v-if="isDeleting" @click="deleteRows">삭제</button>
  </div>
  <div v-if="pageStatusBar.useable" class="wrap_page_status_bar" :class="pageStatusBar.align">
    <p>
      <span>{{currPage}}</span> / <span>{{totalPage}}</span> Pages | Total Rows <span>{{totalRowCnt}}</span>
    </p>
  </div>
  <div :id="gridId" :class="className"></div>
  <Pagination/>
  <Modal v-if="useModal" v-bind="modalProps" v-model:is-open="open" />
  <div v-else></div>
</template>

<style>
  .btn_box{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 5px;
    margin-bottom: 20px;
  }
  .wrap_page_status_bar{
    display: flex;
    align-items: center;
  }
  .wrap_page_status_bar.left{
    justify-content: left;
  }
  .wrap_page_status_bar.center{
    justify-content: center;
  }
  .wrap_page_status_bar.right{
    justify-content: right;
  }
  .wrap_page_status_bar :where(p, span){
    font-size: 14px;
  }
  .wrap_page_status_bar span{
    font-weight: bold;
  }
</style>
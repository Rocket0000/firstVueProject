<script setup>
import { onMounted, defineEmits, watch } from "vue";
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

  const emit = defineEmits(["gridData"]);

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

    emit("gridData", dataProvider, gridView);
  })

  watch([() => props.fields, () => props.columnItems, () => props.rowItems], ([newField, newCol, newRow ]) => {
    dataProvider.setFields(newField);
    gridView.setColumns(newCol);
    dataProvider.setRows(newRow);
  })


  function addRow(){
    gridView.beginInsertRow(0);
  }
</script>


<template>
  <div class="btn_box">
    <button type="button" v-if="isAdding" @click="addRow">추가</button>
    <button type="button" v-if="isSaving">저장</button>
    <button type="button" v-if="isDeleting">삭제</button>
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
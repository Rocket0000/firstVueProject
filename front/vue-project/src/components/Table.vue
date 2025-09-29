<script setup>
import { onMounted, defineEmits, watch, onUpdated } from "vue";
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
    fields: Array,
    className: String
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

</script>


<template>
  <div :id="gridId" :class="className"></div>
</template>


<script setup>
import { onMounted } from "vue";
import { GridView, LocalDataProvider } from 'realgrid';

  const dataProvider = ref(null);
  const gridView = ref(null);

  const props = defineProps({
    gridId: "",
    gridRoot: "",
    columnItems: [],
    rowItems: [],
    fields: []
  })

  onMounted(() => {
    dataProvider.value = new LocalDataProvider(false);
    gridView.value = new GridView(gridId);

    gridView.value.setDataSource(dataProvider.value);
    dataProvider.value.setFields(fields);
    gridView.value.setColumns(columnItems);
    dataProvider.value.setRows(rowItems);
  })
</script>


<template>
  <div id="{{girdId}}"></div>
</template>


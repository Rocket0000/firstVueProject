<script setup>
  import { computed, ref, defineEmits } from 'vue';

  const inputText = ref("");

  const emit = defineEmits(["clickSearch", "changeValue"]);


  function onSearch(){
    emit("clickSearch");
  }

  function onChange(val){
    emit("changeValue", val);
  }

</script>

<template>
  <div>
    <div>
      <input type="text" id="" v-model="inputText" @change="onChange($event.target)">
      <button type="button" @click="onSearch">검색</button>
    </div>
    <p>{{inputText}}</p>
  </div>
</template>
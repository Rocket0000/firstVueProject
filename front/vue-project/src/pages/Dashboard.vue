<script setup>
import Header from '@/components/Header.vue';

let id = 0;

const title = "Dashboard"
const menuItem = [
  {
    id: id++,
    title: "Dashboard",
    src: "/dashboard"
  }
]


</script>

<template>
  <div>
    <Header :title="title" :menuItem="menuItem" />
    <div>

    </div>
  </div>
</template>
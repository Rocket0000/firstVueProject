<script setup>
  const props = defineProps({
    title: "",
    menuItem : [],
  })


</script> 

<template>
  <header>
    <nav>
      <h1>{{title}}</h1>
      <ul>
        <li v-for="item in menuItem" key="{{item.title+item.id}}">
          <a href="{{item.src}}">{{item.title}}</a>
        </li>
      </ul>
    </nav>
  </header>
</template>
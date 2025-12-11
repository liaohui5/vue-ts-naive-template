<template>
  <n-layout class="w-screen h-screen overflow-x-hidden">
    <n-layout-header bordered>
      <nav-bar />
    </n-layout-header>
    <n-layout-content>
      <slot></slot>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import NavBar from "@/components/nav-bar/index.vue";
</script>

<template>
  <n-button quaternary @click="store.switchAppTheme">
    {{ store.isDarkTheme ? "浅色" : "深色" }}
  </n-button>
</template>

<script setup lang="ts">
import { useTheme } from "@/store/theme";
const store = useTheme();
</script>

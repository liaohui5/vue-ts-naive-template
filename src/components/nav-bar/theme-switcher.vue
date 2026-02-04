<template>
  <n-button quaternary circle size="small" @click="store.switchAppTheme">
    <template #icon v-if="store.isDarkTheme">
      <Icon icon="ep:moon" width="1024" height="1024" />
    </template>
    <template #icon v-else>
      <Icon icon="ep:sunny" width="1024" height="1024" />
    </template>
  </n-button>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useTheme } from "@/store/theme";
const store = useTheme();
</script>

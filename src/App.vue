<template>
  <n-config-provider v-bind="store.configProviderProps">
    <template v-if="withoutLayout">
      <router-view />
    </template>
    <template v-else>
      <Layout>
        <router-view />
      </Layout>
    </template>
    <n-global-style />
  </n-config-provider>
</template>

<script setup lang="ts">
import { NGlobalStyle } from "naive-ui";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useTheme } from "@/store/theme";
import Layout from "@/Layout.vue";

const store = useTheme();
const route = useRoute();
const withoutLayout = computed(() => route.meta.withoutLayout);
</script>

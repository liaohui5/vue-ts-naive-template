<template>
  <header class="w-full h-[50px] items-center flex py-2 px-4">
    <div class="logo">
      <img src="/vite.svg" />
    </div>

    <ul tag="ul" class="navs flex-1 inline-flex items-center justify-start">
      <template v-for="link in links">
        <li class="px-4">
          <n-button quaternary type="default" @click="handleClick(link)">{{ link.name }}</n-button>
        </li>
      </template>
    </ul>

    <div class="inline-flex items-center">
      <div class="mr-2">{{ authUser.username }}</div>
      <n-avatar round src="https://raw.githubusercontent.com/liaohui5/images/main/images/202503041407813.jpg" />
      <div class="mx-2">
        <theme-switcher />
      </div>
      <n-button secondary type="error" @click="store.logout">退出登录</n-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeSwitcher from "./theme-switcher.vue";
import { storeToRefs } from "pinia";
import { useAuth } from "@/store";

const store = useAuth();
const { authUser } = storeToRefs(store);

const links = [
  { name: "首页", path: "" },
  { name: "分类", path: "" },
  { name: "我的", path: "" },
];

// TODO: use route
function handleClick(link: { name: string; path: string }) {
  console.log("clicked:", link);
}
</script>

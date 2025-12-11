import type { RouteRecordRaw } from "vue-router";
import Home from "@/views/home/index.vue";
import Login from "@/views/login/index.vue";

export enum RouteNames {
  Login = "login",
  Home = "home",
}

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: RouteNames.Home,
    component: Home,
  },
  {
    path: "/login",
    name: RouteNames.Login,
    component: Login,
    meta: {
      isPublic: true,
      withoutLayout: true,
    },
  },
];

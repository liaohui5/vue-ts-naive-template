<template>
  <div class="p-4">
    <curd-table :store="store" :createColumns="createColumns" />
  </div>
</template>

<script setup lang="ts">
import CurdTable from "@/components/curd-table/index.vue";
import { useArticle } from "@/store";
import { onMounted } from "vue";

function createColumns() {
  return [
    {
      title: "ID",
      key: "id",
    },
    {
      title: "标题",
      key: "title",
    },
  ];
}

const store = useArticle();

store.setSearchQuery([
  {
    field: "id",
    label: "文章ID",
    value: "",
  },
  {
    field: "title",
    label: "文章标题",
    value: "",
  },
]);

// set PaginationFields first
store.setPaginationFields({
  countKey: "total",
  itemsKey: "datas",
});
onMounted(store.list);
</script>

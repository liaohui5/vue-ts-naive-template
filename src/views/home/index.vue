<template>
  <div class="p-4">
    <curd-table :store="store" :createColumns="createColumns" />
  </div>

  <create-article
    :visible="store.createFormVisible"
    :is-loading="store.isCreating"
    @confirm="store.sendCreateRequest"
    @cancel="store.hideCreateForm"
  />

  <update-article
    :visible="store.updateFormVisible"
    :is-loading="store.isUpdating"
    :current-row="store.currentRow"
    @confirm="store.sendUpdateRequest"
    @cancel="store.hideUpdateForm"
  />
</template>

<script setup lang="ts">
import CreateArticle from "./create-article.vue";
import UpdateArticle from "./update-article.vue";
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
    {
      title: "作者",
      key: "author",
    },
    {
      title: "作者ID",
      key: "author_id",
    },
    {
      title: "文章内容",
      key: "content",
    },
    {
      title: "创建时间",
      key: "createdAt",
    },
    {
      title: "修改时间",
      key: "updatedAt",
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

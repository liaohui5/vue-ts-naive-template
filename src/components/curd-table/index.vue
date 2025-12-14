<template>
  <div ref="targetRef">
    <template v-if="props.store.hasSearchQuery">
      <n-form
        inline
        :show-feedback="false"
        label-placement="left"
        label-align="left"
        class="flex items-center border-border border p-2 mb-2"
        :style="{ borderColor: themeVars.buttonColor2Hover }"
      >
        <template v-for="item of searchQuery" :key="item.field">
          <n-form-item :label="item.label" content-class="m-0">
            <n-input v-model:value="item.value" clearable />
          </n-form-item>
        </template>
        <n-form-item class="!m-0">
          <n-button class="!mr-2" type="error" secondary @click="props.store.resetSearchQuery">重置</n-button>
          <n-button type="primary" secondary @click="props.store.search">搜索</n-button>
        </n-form-item>
      </n-form>
    </template>

    <div class="p-2 border border-b-0 flex justify-between" :style="{ borderColor: themeVars.buttonColor2Hover }">
      <div>
        <n-button class="!mr-2" size="small" @click="props.store.showCreateForm" type="success">添加</n-button>
        <n-dropdown :options="exportOptions" @select="props.store.handleExport">
          <n-button size="small">导出</n-button>
        </n-dropdown>
      </div>
      <div>
        <n-button size="small" @click="props.store.refresh" class="!mr-2">
          <Icon icon="icon-park-outline:refresh" />
        </n-button>
        <n-button size="small" @click="maximize" :type="isMaximized ? 'primary' : 'default'" class="!mr-2">
          <Icon icon="icon-park-outline:full-screen-one" />
        </n-button>
        <n-button size="small" @click="toggleFullscreen" :type="isFullscreen ? 'primary' : 'default'">
          <Icon icon="icon-park-outline:full-screen-two" />
        </n-button>
      </div>
    </div>

    <n-data-table v-bind="tableProps" />

    <div class="flex my-2 justify-center">
      <n-pagination v-bind="paginationProps" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, h } from "vue";
import { NButton, NPopconfirm, useThemeVars } from "naive-ui";
import { Icon } from "@iconify/vue";
import type { CurdStore } from "@/store/curd";
import type { DataTableColumns, PaginationProps, TableProps } from "naive-ui";
import type { ISearchParams } from "@/types/api";
import { useMaximize } from "@/hooks/useMaxium";
import { useFullscreen } from "@vueuse/core";

interface CurdTableProps {
  store: CurdStore<any>;
  createColumns: () => DataTableColumns;
  createActionColumns?: () => DataTableColumns;
  [key: string]: any;
  // can not use extends directly
  // interface CurdTableProps extends TableProps
}

const themeVars = useThemeVars();

const props = withDefaults(defineProps<CurdTableProps>(), {
  createActionColumns(): DataTableColumns {
    const { store } = this as CurdTableProps;
    return [
      {
        title: "操作",
        key: "",
        render(row) {
          const updateButton = h(
            NButton,
            {
              circle: false,
              size: "small",
              secondary: true,
              class: "!mr-2",
              onClick: () => store.showUpdateForm(row),
            },
            {
              default: () => h(Icon, { icon: "material-symbols:edit" }),
            },
          );
          const deleteButton = h(
            NButton,
            {
              type: "error",
              circle: false,
              size: "small",
              secondary: true,
            },
            {
              default: () => h(Icon, { icon: "material-symbols:delete" }),
            },
          );
          const deleteConfirm = h(
            NPopconfirm,
            {
              onPositiveClick: () => store.sendDeleteRequest(row),
            },
            {
              default: () => "确定要删除吗?",
              trigger: () => deleteButton,
            },
          );
          return h("div", null, {
            default: () => [updateButton, deleteConfirm],
          });
        },
      },
    ];
  },
});

const tableProps = computed(() => {
  return {
    pagination: false,
    data: props.store.items,
    columns: [
      // build columns
      ...props.createColumns.call(props),
      ...props.createActionColumns.call(props),
    ] as DataTableColumns,
  } as unknown as TableProps;
});

const paginationProps = computed(() => {
  return {
    itemCount: props.store.count,
    pageSize: props.store.pageSize,
    pageSizes: props.store.pageSizeOptions,
    showQuickJumper: true,
    showSizePicker: true,
    onUpdatePage: props.store.setPage,
    onUpdatePageSize: props.store.setPageSize,
  } as unknown as PaginationProps;
});

// search form
const searchQuery = computed(() => props.store.searchQuery as unknown as Required<ISearchParams>);

// tool bar
const { maximize, isMaximized } = useMaximize();
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();
const exportOptions = computed(() => {
  return props.store.supportedFormats.map((item) => ({
    label: `导出 ${item}`,
    key: item,
  }));
});
</script>

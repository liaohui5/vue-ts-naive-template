import { computed, ref, type Ref } from "vue";
import { log, notify } from "@/tools";
import { usePagination, useRequest, type UseHookExposure, type UsePaginationExposure } from "alova/client";
import type { IPagination, IPaginationFields, ISearchParams } from "@/types/api";
import type { AlovaGenerics, Method, RespondedAlovaGenerics } from "alova";

// 默认的 "当前行" 的值
export const EMPTY_CURRENT_ROW = Object.freeze({});
export const plaseImplementFirst = () => Promise.reject("Please implement first");

// 操作数据的 CURD 接口
export type AlovaMethod = Method<RespondedAlovaGenerics<AlovaGenerics, any, any>>;
export interface ICurdService {
  listApi: (pagination: IPagination, search: ISearchParams) => AlovaMethod;
  deleteApi?: (id: string | number) => AlovaMethod;
  updateApi?: (id: string | number, data: any) => AlovaMethod;
  createApi?: (data: any) => AlovaMethod;
}

/**
 * CURD 操作类, 由于 pinia 不会识别 prototype 上的属性&方法
 * 所以直接将所有属性全部绑定到对象上, 而不是 prototype 上, 这样一来
 * 只要继承这个类就可以直接获得所有 curd 方法
 */
export class CurdStore<T = unknown> {
  service: ICurdService;

  // loading
  isFetching = ref<boolean>(false);
  isCreating = ref<boolean>(false);
  isUpdating = ref<boolean>(false);
  isDeleting = ref<boolean>(false);

  // list with pagination params
  items: Ref<Array<T>>;
  count: Ref<number>;
  page = ref<number>(1);
  setPage = (page: number) => {
    this.page.value = page;
  };
  pageSize = ref<number>(10);
  setPageSize = (size: number) => {
    this.pageSize.value = size;
  };
  pageSizeOptions = ref([10, 15, 20, 30, 40, 50]);
  pagination = computed<IPagination>(() => ({
    // 发送给服务端的分页参数(如: ?page=1&limit=10)
    page: this.page.value,
    limit: this.pageSize.value,
  }));

  // listAction: UsePaginationExposure<AlovaGenerics, T[], any>;
  list: UseHookExposure["send"];
  paginationFields = ref<IPaginationFields>({
    // 服务端响应的字段映射(如: { total: 100, rows: [...] })
    itemsKey: "items",
    countKey: "count",
  });
  setPaginationFields = (fields: IPaginationFields) => {
    this.paginationFields.value = fields;
  };

  // search
  search: UsePaginationExposure<AlovaGenerics, T[], any>["refresh"];
  searchQuery = ref<ISearchParams>([]);
  hasSearchQuery = computed(() => this.searchQuery.value.length > 0);
  _submitSearchQuery = computed<ISearchParams>(() => {
    return this.searchQuery.value.map((item) => {
      return {
        field: item.field,
        value: item.value,
        // remove label field
      };
    });
  });
  setSearchQuery = (search: ISearchParams) => {
    this.searchQuery.value = search;
  };
  resetSearchQuery = () => {
    const searchQuery = this.searchQuery.value;
    for (const item of searchQuery) {
      item.value = "";
    }
  };
  refresh: UsePaginationExposure<AlovaGenerics, T[], any>["refresh"];

  // create data
  createFormVisible = ref<boolean>(false);
  showCreateForm = () => {
    this.createFormVisible.value = true;
  };
  hideCreateForm = () => {
    this.createFormVisible.value = false;
  };
  sendCreateRequest: (data: any) => Promise<void> = plaseImplementFirst;

  // delete data
  primaryKey = ref<keyof T>("id" as any);
  setPrimaryKey = (field: string) => {
    this.primaryKey.value = field;
  };
  getPrimaryKey = (row?: T): string => {
    const key = this.primaryKey.value;
    if (row && typeof row === "object" && key in row) {
      // @ts-ignore
      return row[key];
    }
    return this.currentRow.value[key];
  };
  sendDeleteRequest: (row: T) => Promise<void> = plaseImplementFirst;

  // update data
  currentRow = ref<T>({} as T);
  updateFormVisible = ref<boolean>(false);
  setCurrentRow = (row: T) => {
    this.currentRow.value = row;
  };
  showUpdateForm = (row: T) => {
    this.setCurrentRow(row);
    this.updateFormVisible.value = true;
  };
  hideUpdateForm = () => {
    this.setCurrentRow(EMPTY_CURRENT_ROW as T);
    this.updateFormVisible.value = false;
  };
  sendUpdateRequest: (patchData: Partial<T>) => Promise<void> = plaseImplementFirst;

  supportedFormats = computed<Array<"csv" | "json" | "xlsx">>(() => ["csv", "json", "xlsx"]);
  handleExport = (format: "csv" | "json" | "xlsx") => {
    alert(`TODO:${format}`);
  };

  // TODO: 导出
  constructor(service: ICurdService) {
    // list
    this.service = service;
    const listAction = usePagination(() => service.listApi(this.pagination.value, this._submitSearchQuery.value), {
      total: (res) => res[this.paginationFields.value.countKey],
      data: (res) => res[this.paginationFields.value.itemsKey],
      initialData: {
        // 默认数据
        count: 0,
        rows: [],
      },
      immediate: false,
    });
    // this.listAction = listAction;
    this.isFetching = listAction.loading;
    this.list = listAction.send;
    this.refresh = listAction.refresh;
    this.search = listAction.refresh; // search
    this.page = listAction.page;
    this.pageSize = listAction.pageSize;
    this.count = listAction.total;
    this.items = listAction.data;
    listAction.onError((alovaInst) => {
      notify.showMsg(`数据获取失败: ${alovaInst.error.message}`);
      log("[CurdStore@list]数据获取失败", alovaInst);
    });

    this._initCreateAction();
    this._initDeleteAction();
    this._initUpdateAction();
  }

  private _initCreateAction() {
    if (!this.service.createApi) {
      return;
    }
    const { createApi } = this.service;
    const createAction = useRequest((data) => createApi(data), {
      immediate: false,
    })
      .onSuccess(async () => {
        this.hideCreateForm();
        notify.showMsg("数据创建成功");
        await this.refresh();
      })
      .onError((alovaInst) => {
        log("[CurdStore@create]数据创建失败", alovaInst);
        notify.showErrMsg(`数据创建失败: ${alovaInst.error.message}`);
      });
    this.isCreating = createAction.loading;
    this.sendCreateRequest = createAction.send;
  }

  private _initDeleteAction() {
    if (!this.service.deleteApi) {
      return;
    }
    const { deleteApi } = this.service;
    const deleteAction = useRequest((id) => deleteApi(id), {
      immediate: false,
    })
      .onSuccess(async () => {
        await this.refresh();
        notify.showMsg("数据删除成功");
      })
      .onError((alovaInst) => {
        log("[CurdStore@delete]数据删除失败", alovaInst);
        notify.showErrMsg(`数据删除失败: ${alovaInst.error.message}`);
      });
    this.isDeleting = deleteAction.loading;
    this.sendDeleteRequest = async (row: T) => {
      const pk = this.getPrimaryKey(row);
      if (!pk) {
        log("[CurdStore@delete]主键字段获取失败, 请检查传入的数据是否有误");
        return;
      }
      await deleteAction.send(pk);
    };
  }

  private _initUpdateAction() {
    if (!this.service.updateApi) {
      return;
    }
    const { updateApi } = this.service;
    const updateAction = useRequest((id, data) => updateApi(id, data), {
      immediate: false,
    })
      .onSuccess(async () => {
        await this.refresh();
        notify.showMsg("数据更新成功");
      })
      .onError((alovaInst) => {
        log("[CurdStore@update]数据更新失败", alovaInst);
        notify.showErrMsg(`数据更新失败: ${alovaInst.error.message}`);
      })
      .onComplete(() => {
        // reset current row data
        this.hideUpdateForm();
      });
    this.isUpdating = updateAction.loading;
    this.sendUpdateRequest = async (patchData: Partial<T>) => {
      if (!this.currentRow) {
        log("[CurdStore@update]请先设置 currentRow, 否则无法自动获取主键字段");
        return;
      }
      const pk = this.getPrimaryKey();
      if (!pk) {
        log("[CurdStore@update]主键字段获取失败, 请检查传入的数据是否有误");
        return;
      }
      await updateAction.send(pk, patchData);
    };
  }
}

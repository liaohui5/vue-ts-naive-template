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
  listApi: (pagination: IPagination, search: string) => AlovaMethod;
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

  // 请求状态
  isFetching = ref<boolean>(false);
  isCreating = ref<boolean>(false);
  isUpdating = ref<boolean>(false);
  isDeleting = ref<boolean>(false);

  // 数据列表
  items: Ref<Array<T>>;
  count: Ref<number>;

  // 发送给服务端的分页参数(如: ?page=1&limit=10)
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
    page: this.page.value,
    limit: this.pageSize.value,
  }));

  // listAction: UsePaginationExposure<AlovaGenerics, T[], any>;
  list: UseHookExposure["send"];

  // 服务端响应的字段映射(如: { total: 100, rows: [...] })
  paginationFields = ref<IPaginationFields>({
    itemsKey: "items",
    countKey: "count",
  });
  setPaginationFields = (fields: IPaginationFields) => {
    this.paginationFields.value = fields;
  };

  // 搜索参数: 需要服务端支持
  search: UsePaginationExposure<AlovaGenerics, T[], any>["refresh"];
  searchQuery = ref<ISearchParams>([]);
  hasSearchQuery = computed(() => this.searchQuery.value.length > 0);
  _submitSearchQuery = computed<string>(() => {
    // 最终发送到服务端的参数字符串 [{"field": "xxx", value: "xxx"}]
    const searchQuiers = this.searchQuery.value
      .filter((item) => Boolean(item.value))
      .map((item) => {
        return {
          field: item.field,
          value: item.value,
        };
      });
    return JSON.stringify(searchQuiers);
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

  // 创建数据
  createFormVisible = ref<boolean>(false);
  showCreateForm = () => {
    this.createFormVisible.value = true;
  };
  hideCreateForm = () => {
    this.createFormVisible.value = false;
  };
  sendCreateRequest: (data: any) => Promise<void> = plaseImplementFirst;

  // 删除数据
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

  // 更新数据
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

  /**
   * 导出数据
   */
  supportedFormats = computed<Array<"csv" | "json" | "xlsx">>(() => ["csv", "json", "xlsx"]);
  handleExport = (format: "csv" | "json" | "xlsx") => {
    // TODO: 实现导出功能
    notify.showMsg("导出功能尚未实现");
  };

  constructor(service: ICurdService) {
    this.service = service;
    const listAction = usePagination(() => service.listApi(this.pagination.value, this._submitSearchQuery.value), {
      total: (res) => res[this.paginationFields.value.countKey],
      data: (res) => res[this.paginationFields.value.itemsKey],
      initialData: {
        // 未发送请求前的默认数据
        count: 0,
        rows: [],
      },
      immediate: false,
    });
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

  /**
   * 初始化创建数据的相关逻辑
   *  - 监听成功后, 隐藏创建表单, 显示成功信息, 并刷新数据
   *  - 监听失败后, 显示错误信息
   */
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

  /**
   * 初始化删除数据的相关逻辑
   *  - 监听成功后, 刷新数据
   *  - 监听失败后, 显示错误信息
   */
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

    /**
     * 删除数据
     * @param row - 需要删除的数据
     * @returns Promise<void>
     * @throws {Error} 如果主键字段获取失败, 请检查传入的数据是否有误
     */
    this.sendDeleteRequest = async (row: T) => {
      const pk = this.getPrimaryKey(row);
      if (!pk) {
        log("[CurdStore@delete]主键字段获取失败, 请检查传入的数据是否有误");
        return;
      }
      await deleteAction.send(pk);
    };
  }

  /**
   * 初始化更新数据的操作
   *  - 监听成功后, 刷新数据
   *  - 监听失败后, 显示错误信息
   *  - 监听完成后, 隐藏编辑表单
   */
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

    /**
     * 发送更新请求
     * @param patchData 需要更新的数据, 是一个 Partial<T> 类型
     * @returns Promise<void>
     * @remarks
     * 请先设置 currentRow, 否则无法自动获取主键字段
     * 主键字段获取失败, 请检查传入的数据是否有误
     */
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

// 响应数据分页
export type PaginationData<T> = {
  count: number;
  rows: Array<T>;
};

// 响应数据分页字段映射
export interface IPaginationFields {
  itemsKey: string; // 存放数据的字段 [{id:xx, name:xx, ...}]
  countKey: string; // 存放总条数的字段 100
}

// 分页
export type IPagination = {
  page: number; // 当前页
  limit: number; // 每页多少条数据
};

// 搜索数据
export type ISearchParams = Array<{
  field: string; // 搜索的字段名(如: email)
  value: string; // 搜索的字段值(如: foobar@example.com)
  label?: string; // 显示到页面上的
}>;

import {TableColumnType as AntdColumnType} from "antd";
import {ColumnsState, ProColumnType as AntdProColumnType} from "@ant-design/pro-table";
import {OperatorKeys} from "@moln/data-source";
import {FilterElement} from "../filters/interfaces";

interface Filterable {
    /**
     * 调整默认搜索控件支持的匹配规则, 比如文本搜索 <TextFilter /> 默认： ["startwith", "eq"], “开关匹配”和“等于”
     */
    operators?: OperatorKeys[],

    /**
     * 自定义过滤器控件
     */
    filter?: FilterElement,

    /**
     * 搜索字段名，默认为 dataIndex 的值
     */
    field?: string
}

/**
 * 废弃 'filters' | 'filterMultiple'， 交由 filterable 处理, {filterable: { filter: <SelectFilter />}}
 */
export interface ColumnType<T> extends Omit<AntdColumnType<T>,  'filters' | 'filterMultiple'> {

    /**
     * 启用过滤
     * - true 自动识别字段类型，提供对应搜索控件。
     */
    filterable?: true | Filterable,
    children?: ColumnType<T>[];
    valueEnum?: ProColumnType<T>["valueEnum"]
}

/**
 * 废弃 'filters' | 'filterMultiple'， 交由 filterable 处理, {filterable: { filter: <SelectFilter />}}
 */
export interface ProColumnType<T = any, ValueType = 'text'> extends Omit<AntdProColumnType<T, ValueType>, 'filters' | 'filterMultiple'> {
    filterable?: true | Filterable,
    children?: ProColumnType<T>[],

    /**
     * @deprecated Move to `ProTableProps['columnsState']['defaultValue']` instead
     */
    defaultState?: ColumnsState,
}

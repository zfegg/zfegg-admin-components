import {ColumnType, ProColumnType} from "../interfaces";
import React, {ComponentProps, ReactNode, useEffect, useState} from "react";
import {Button, Card, Col, Form, Row} from "antd";
import {DataSourceFilterItem, IDataSource, SortOptions2} from "@moln/data-source";
import {ProFieldValueType} from "@ant-design/pro-utils";
import {JSONSchema7TypeName} from "json-schema";
import dayjs from "dayjs";
import {FilterValue} from "../../filters/interfaces";
import DateRangeFilter from "../../filters/DateRangeFilter";
import DigitFilter from "../../filters/DigitFilter";
import RadioFilter from "../../filters/RadioFilter";
import CheckboxFilter from "../../filters/CheckboxFilter";
import TextFilter from "../../filters/TextFilter";
import {useLocation, useNavigate} from "react-router";
import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import {getColumnSchema} from "../../utils";
import {schemaToColumns, valueEnumToOptions} from "../utils";
import {Observer} from "mobx-react";
import {CursorPagination} from "../../pagination";
import ProTable from "@ant-design/pro-table";

const jsonSchemaTypes = {
    string: 'text',
    number: 'digit',
    integer: 'digit',
    boolean: 'switch',
    'date-time': 'dateTime',
    'date': 'date',
} as Record<JSONSchema7TypeName | string, ProFieldValueType>

const jsonParse = JSON.parse;
const entries = Object.entries

const filterValidator = (_: any, values: FilterValue) => {
    if (entries(values).some(([, value]) => isEmptyValue(value))) {
        return Promise.reject('请输入过滤内容')
    }
    return Promise.resolve();
}

const isFilterItem = (obj: object): obj is DataSourceFilterItem<any> => isPlainObject(obj) && 'operator' in obj && 'value' in obj

function dataSourceFilterToFilterEntries(dsFilter: IDataSource<any>['filter']): FilterEntries {
    const result: FilterEntries = {}
    dsFilter && dsFilter.filters.forEach((filter) => {
        if (isFilterItem(filter)) {
            const {field, operator, value} = filter
            if (! result[field]) {
                result[field] = []
            }

            result[field].push([operator!, value])
        }
    })

    return result
}

type FilterKey = any[]
const filterDropdown = (field: string, filter: ReactNode): ColumnType<any>['filterDropdown'] => {
    return ({setSelectedKeys, selectedKeys, confirm, clearFilters, visible}) => {

        const handleClearFilter = () => {
            clearFilters!();
            form.resetFields();
            setClearDisabled(true)
            confirm();
            console.log('clear filter');
        }
        const handleSubmit = (values: Record<string, any>) => {
            setSelectedKeys(entries(values[field]) as FilterKey)
            confirm();
        }

        const [clearDisabled, setClearDisabled] = useState(true);

        const [form] = Form.useForm();

        // console.log('render filter', field, visible, selectedKeys, form)
        useEffect(() => {
            if (visible && selectedKeys && selectedKeys.length) {
                form.setFieldsValue({[field]: Object.fromEntries(selectedKeys as FilterKey)})
                setClearDisabled(false)
            }
        }, [visible])

        return (
            <Form form={form} onFinish={handleSubmit} layout={'inline'} onValuesChange={(values) => { setClearDisabled(! values[field])}}>
                <Card
                    size="small"
                    title={(
                        <Form.Item
                            name={field}
                            rules={[{validator: filterValidator}]}
                        >
                            {filter}
                        </Form.Item>
                    )}
                >
                    <Row justify="space-between">
                        <Col>
                            <Button type="link" disabled={clearDisabled} onClick={handleClearFilter} size="small" >
                                清空
                            </Button>
                        </Col>
                        <Col>
                            <Button type="primary" htmlType={'submit'} size="small">
                                确认
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </Form>
        )
    }
}

function isEmptyValue(value: any) {
    return value === null
        || value === undefined
        || (isArray(value) && value.length === 0)
        || value === ''
    ;
}

function filterEmpty(filters: Record<string, any>): FilterEntries {
    const allFieldFilters: FilterEntries = {}
    if (isPlainObject(filters)) {
        entries(filters).forEach(([field, fieldFilters]) => {
            // fieldFilters type: `[op, value][]`
            if (isArray(fieldFilters)) {
                const fieldFilters2:  FilterEntries[0] = []

                fieldFilters.forEach((filter) => {
                    if (isArray(filter) && filter.length === 2 && ! isEmptyValue(filter[1])) {
                        fieldFilters2.push(filter as FilterEntries[0][0])
                    }
                })
                if (fieldFilters2.length) {
                    allFieldFilters[field] = fieldFilters2;
                }
            }
        })
    }

    return allFieldFilters
}

/**
 * 解码特殊URL字符
 * @param str
 */
function decodeSpecURI(str: string) {
    return str.replace(
        /%([0-9A-F]{2})/ig,
        (a, b) => {
            const str = String.fromCharCode(parseInt(b, 16));
            return "[]{}':,".indexOf(str) === -1 ? a : str
        }
    )
}

type FilterEntries = Record<string, [keyof FilterValue, FilterValue[keyof FilterValue]][]>
interface ChangeHandler {
    cursor(cursor:  string | number | null | undefined): void;
    page(num?: number): void;
    pageSize(num?: number): void;
    filter(filters: FilterEntries): void;
    sort(sort: IDataSource<any>['sort']): void;
    handle(): void;
}

class RouteQueryHandler implements ChangeHandler {
    constructor(
        private navigate: ReturnType<typeof useNavigate>,
        private query: URLSearchParams,
        private bindRoute: Exclude<BindRoute, boolean>,
    ) {
    }
    cursor(cursor:  string | number | null | undefined): void {
        this.querySetOrDel('cursor', cursor)
    }
    page(num: number | undefined) {
        this.querySetOrDel('page', num)
    }
    pageSize(num: number | undefined) {
        this.querySetOrDel('pageSize', num)
    }
    filter(filters: FilterEntries) {
        this.querySetOrDel('filter', filters)
    }
    sort(sort: IDataSource<any>['sort']) {
        this.querySetOrDel('sort', sort)
    }
    private querySetOrDel(key: string, data: any) {
        if (typeof data === "number" || typeof data === 'string') {
            this.query.set(key, data as any)
            return;
        } else if (typeof data === "object" && ! isEmpty(data)) {
            this.query.set(key, JSON.stringify(data))
            return;
        } else {
            this.query.delete(key)
        }
    }
    handle() {
        const {navigate, bindRoute, query} = this;
        const options = bindRoute === 'replace' ? {replace: true} : undefined

        navigate({
            search: decodeSpecURI(query.toString())
        }, options)
    }
}

class DataSourceChangeHandler implements ChangeHandler {
    private static flag = undefined
    constructor(private dataSource: IDataSource<any>) {
    }
    cursor(cursor: string | number | null) {
        const paginator = this.dataSource.paginator
        if (paginator && paginator.type === 'cursor') {
            paginator.cursor = cursor
        }
    }
    page(num: number | undefined) {
        this.dataSource.page = num || 1
    }
    pageSize(num: number | undefined) {
        this.dataSource.pageSize = num
    }
    filter(filters: FilterEntries) {
        // this.dataSource.filter = normalizeFilter(this.normalizeFilters(filters))
        this.dataSource.setFilters(this.normalizeFilters(filters))
    }
    sort(sort: IDataSource<any>['sort']) {
        this.dataSource.setSort(sort!);
    }
    handle() {
        this.dataSource.fetch()
    }
    private normalizeFilters = (filters: FilterEntries) => {
        const filters2: (DataSourceFilterItem<any> & { flag: undefined })[] = []
        entries(filters).forEach(([field, values]) => {
            values.forEach(([operator, value]) => {
                filters2.push({
                    field,
                    value,
                    operator,
                    flag: DataSourceChangeHandler.flag,
                })
            })
        })

        const baseFilters = this.dataSource.filter?.filters.filter((item) => Object.keys(item).indexOf('flag') === -1) || []
        const result = baseFilters.concat(filters2)

        return result as DataSourceFilterItem<any>[];
    }
}

function normalizeNumber(value: string | null) {
    let result = jsonParse(value!)
    if (typeof result === 'number') {
        return result
    }
    return null;
}

function useParseFromQuery(dataSource: IDataSource<any>, bindRoute: BindRoute): ChangeHandler {

    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const dsHandler = new DataSourceChangeHandler(dataSource);

    const handler = bindRoute
        ? new RouteQueryHandler(navigate, query, bindRoute === true ? 'replace' : bindRoute as any)
        : dsHandler

    // 监听路由参数 绑定 DataSource
    const trySet = (
        key: keyof ChangeHandler,
        normalize: (str: string | null) => any,
    ) => {
        const str = query.get(key)

        useEffect(() => {
            if (! bindRoute) return ;
            try {
                const val = normalize(str);
                if (! isEmptyValue(val)) {
                    console.log('try set:', key, str, val);
                    dsHandler[key](val)
                }
            } catch (e) {
                console.error('try set error:', e)
            }
        }, [dataSource, str, bindRoute])

        return str;
    }

    const filterStr = trySet('filter', (value) => {
        let result = jsonParse(value!)
        if (! isPlainObject(result)) {
            return {};
        }
        return filterEmpty(result)
    });
    const sortStr = trySet('sort', (value) => {
        let result = jsonParse(value!)
        if (! isArray(value)) {
            return null;
        }

        return result
    });
    const page = trySet('page', normalizeNumber);
    const pageSize = trySet('pageSize', normalizeNumber);
    const cursor = trySet('cursor', normalizeNumber);

    useEffect(() => {
        if (! bindRoute) return ;
        dataSource.fetch()
    }, [filterStr, sortStr, page, pageSize, cursor])

    return handler
}

function normalizeColumns<T extends Record<string, any>>(
    columns: (ColumnType<T> | ProColumnType<T, any>)[],
    dataSource: IDataSource<T>,
) {
    const filterEntries = dataSourceFilterToFilterEntries(dataSource.filter)
    columns.forEach((col) => {
        const schema = dataSource.schema.schema
        const {title, filterable} = col;
        let dataIndex = col.dataIndex as string[];
        let valueType = (col as any).valueType as ProFieldValueType

        // Normalize filterable
        if (! dataIndex) {
            return ;
        }

        dataIndex = isArray(dataIndex) ? dataIndex : [dataIndex];
        const dataIndexStr = dataIndex.join(".")

        const columnSchema = getColumnSchema(schema, dataIndex) || {type: "string"}

        if (! title && columnSchema.title) {
            col.title = columnSchema.title || dataIndexStr
        }

        // Normalize sortable
        const sortOrder = dataSource.sort?.find(item => 'field' in item && item.field === dataIndexStr) || null;
        col.sortOrder = sortOrder && (sortOrder.dir === 'desc'  ? 'descend' : 'ascend') as any

        if (! valueType) {
            const schemaType: string = (isArray(columnSchema.type)
                ? columnSchema.type.find(type => type !== 'null')
                : columnSchema.type) as string;

            if ((col as any).valueEnum) {
                valueType = 'select'
            } else if (columnSchema.format && jsonSchemaTypes[columnSchema.format]) {
                valueType = jsonSchemaTypes[columnSchema.format]
            } else if (jsonSchemaTypes[schemaType]) {
                valueType = jsonSchemaTypes[schemaType]
            } else {
                valueType = 'text'
            }
        }

        (col as any).valueType = valueType

        if (! filterable) {
            return ;
        }
        // console.log(dataIndex, col.filteredValue, toJS(dataSource.filter))

        const filterOptions = filterable === true ? {} : filterable;
        const field = filterOptions.field || (dataIndex[0]) as string;

        col.filteredValue = filterEntries[field] as any[] || null;

        let filter = filterOptions.filter;

        if (! filter) {
            if (valueType === "date") {
                filter = <DateRangeFilter/>;
            } else if (valueType === "dateTime") {
                filter = <DateRangeFilter showTime={{defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],}} />;
            } else if (valueType === "digit") {
                filter = <DigitFilter operators={filterOptions.operators}/>;
            } else if (valueType === "switch") {
                filter = <RadioFilter options={[{label: '打开', value: true}, {label: '关闭', value: false}]}/>;
            } else if (valueType === "select" && 'valueEnum' in col && typeof col.valueEnum !== 'function') {
                filter = <CheckboxFilter options={valueEnumToOptions(col.valueEnum!)}/>;
            } else {
                filter = <TextFilter operators={filterOptions.operators}/>;
            }
        }

        col.filterDropdown = filterDropdown(field, filter)
    })
}

export type BindRoute = boolean | 'push' | 'replace'

type TableProps = ComponentProps<typeof ProTable>

export function initTable<T extends Record<string, any>>(
    dataSource: IDataSource<any>,
    columns: T[] = schemaToColumns(dataSource.schema.schema) as any[],
    bindRoute: BindRoute,
    autoFetch: boolean,
    propsPagination: TableProps['pagination']
): TableProps {
    normalizeColumns(columns, dataSource)

    const handler = useParseFromQuery(dataSource, bindRoute)
    const paginator = dataSource.paginator;
    let pagination: TableProps['pagination'];
    let tableViewRender: TableProps['tableViewRender'];
    if (paginator && paginator.type === 'cursor') {
        tableViewRender = (props, defaultDom) => {
            return (
                <>
                    {defaultDom}
                    <Observer>{() =>
                        <CursorPagination
                            size={props.size}
                            pageSizeOptions={propsPagination ? propsPagination.pageSizeOptions?.map(Number) : undefined}
                            pageSize={paginator.pageSize}
                            disabledPrev={!dataSource.meta.prev_cursor}
                            disabledNext={!dataSource.meta.next_cursor}
                            onClickPrev={() => {
                                handler.cursor(dataSource.meta.prev_cursor)
                                handler.handle()
                            }}
                            onClickNext={() => {
                                handler.cursor(dataSource.meta.next_cursor)
                                handler.handle()
                                console.log(dataSource.meta, handler)
                            }}
                            onShowSizeChange={(value) => {
                                handler.pageSize(value)
                                handler.handle()
                            }}
                        />
                    }</Observer>
                </>
            )
        }
        pagination = false
    } else {
        pagination = paginator && {
            total: dataSource.total,
            pageSize: dataSource.pageSize,
            current: dataSource.page,
            ...propsPagination
        }
    }

    useEffect(() => {
        if (autoFetch) {
            // console.log(dataSource, 'fetchInit')
            dataSource.fetchInit();
        }
    }, [dataSource, autoFetch])

    return {
        rowKey: '__uuid',
        loading: dataSource.loading,
        pagination,
        dataSource: dataSource.toJS(true),
        columns: columns.slice(),
        onChange: (pagination, filters, sorter, {action}) => {

            switch (action) {
            case "paginate":
                handler.page(pagination.current)
                handler.pageSize(pagination.pageSize)
                break;
            case "filter":
                handler.filter(filterEmpty(filters))
                break;
            case "sort":
                if (! isArray(sorter)) {
                    sorter = [sorter]
                }
                const sort = sorter.filter(item => ! isEmpty(item) && item.order)
                    .map<SortOptions2<any>>(({field, order}) => ({
                        field: field as string,
                        dir: order === 'descend' ? 'desc' : 'asc'
                    }))
                handler.sort(sort)
                break;
            }

            handler.handle()
        },
        tableViewRender,
    }
}
import {ColumnType, ProColumnType} from "../interfaces";
import React, {ReactNode, useEffect, useState} from "react";
import {Button, Card, Col, Form, Row, TableProps} from "antd";
import {IDataSource, OperatorKeys} from "@moln/data-source";
import {ProFieldValueType} from "@ant-design/pro-utils";
import {JSONSchema7TypeName} from "json-schema";
import dayjs from "dayjs";
import {FilterValue, FilterValues} from "../../filters/interfaces";
import DateRangeFilter from "../../filters/DateRangeFilter";
import DigitFilter from "../../filters/DigitFilter";
import RadioFilter from "../../filters/RadioFilter";
import CheckboxFilter from "../../filters/CheckboxFilter";
import TextFilter from "../../filters/TextFilter";
import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import {getColumnSchema} from "../../utils";
import {valueEnumToOptions} from "../utils";
import {Observer} from "mobx-react-lite";
import {CursorPagination} from "../../pagination";
import {ProTableProps} from "@ant-design/pro-table";
import {SortOptions2, DataSourceFilterItem} from "@moln/data-source/dist/interfaces";

type TableFilters = Record<string, [OperatorKeys, any][] | null>
type FilterKey = any[]
type DataRow = Record<string, any>
// type DataSourceFilterItem<T extends Record<string, any>> = Extract<Exclude<IDataSource<T>['filter'], null>['filters'][0], {value: any}>

const jsonSchemaTypes = {
    string: 'text',
    number: 'digit',
    integer: 'digit',
    boolean: 'switch',
    'date-time': 'dateTime',
    'date': 'date',
} as Record<JSONSchema7TypeName | string, ProFieldValueType>

const entries = Object.entries

const filterValidator = (_: any, values: FilterValue) => {
    if (entries(values).some(([, value]) => isEmptyValue(value))) {
        return Promise.reject('请输入过滤内容')
    }
    return Promise.resolve();
}

const isFilterItem = (obj: object): obj is DataSourceFilterItem<any> => isPlainObject(obj) && 'operator' in obj && 'value' in obj

export function isEmptyValue(value: any) {
    return value === null
        || value === undefined
        || (isArray(value) && value.length === 0)
        || value === ''
        ;
}


export function fromDataSourceFilterToFilterValues(dsFilter: IDataSource<any>['filter']): FilterValues {
    const result: FilterValues = {}
    dsFilter && dsFilter.filters.forEach((filter) => {
        if (isFilterItem(filter)) {
            const {field, operator, value} = filter
            if (! result[field]) {
                result[field] = {}
            }

            result[field][operator!] = value
        }
    })

    return result
}

const filterDropdown = (field: string, filter: ReactNode): ColumnType<any>['filterDropdown'] => {
    return ({setSelectedKeys, selectedKeys, confirm, clearFilters, visible}) => {

        const handleClearFilter = () => {
            clearFilters!();
            form.resetFields();
            setClearDisabled(true)
            confirm();
            console.log('clear filter');
        }
        const handleSubmit = (values: DataRow) => {
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
                    styles={{body: {minWidth: 130}}}
                    size={"small"}
                    actions={[
                        <Button key={'a'} type="link" disabled={clearDisabled} onClick={handleClearFilter} size="small" >
                            清空
                        </Button>,
                        <Button key={'b'} type="primary" htmlType={'submit'} size="small">
                            确认
                        </Button>
                    ]}
                >
                    <Form.Item
                        name={field}
                        rules={[{validator: filterValidator}]}
                    >
                        {filter}
                    </Form.Item>
                </Card>
            </Form>
        )
    }
}


// class DataSourceChangeHandler<T extends DataRow> implements ChangeHandler<T> {
//     private static flag = undefined
//     constructor(private dataSource: IDataSource<T>) {
//     }
//     cursor(cursor: string | number | null) {
//         const paginator = this.dataSource.paginator
//         if (paginator && paginator.type === 'cursor') {
//             paginator.cursor = cursor
//         }
//     }
//     page(num?: number) {
//         this.dataSource.page = num || 1
//     }
//     pageSize(num?: number) {
//         this.dataSource.pageSize = num
//     }
//     filter(filters: FilterValues) {
//         // this.dataSource.filter = normalizeFilter(this.fromFilterValuesToDSFilters(filters))
//         // this.dataSource.setFilters(fromTableFiltersToDSFilters(filters))
//     }
//     sort(sort: IDataSource<T>['sort']) {
//         this.dataSource.setSort(sort!);
//     }
//     handle() {
//         this.dataSource.fetch()
//     }
// }


function normalizeColumns<T extends DataRow,  ValueType = "text">(
    columns: (ProColumnType<T, ValueType> | ColumnType<T>)[],
    dataSource: IDataSource<T>,
): ProColumnType<T, ValueType>[] {
    type TColumn = ProColumnType<T, ValueType>
    const filterValues = fromDataSourceFilterToFilterValues(dataSource.filter)
    const schema = dataSource.schema.schema

    return columns.map((column): TColumn => {
        const col = column as TColumn
        const {title, filterable} = col;
        let dataIndex = col.dataIndex as string[];
        let valueType = col.valueType as ProFieldValueType

        // Normalize filterable
        if (! dataIndex) {
            return col;
        }

        dataIndex = isArray(dataIndex) ? dataIndex : [dataIndex];
        const dataIndexStr = dataIndex.join(".")

        const columnSchema = getColumnSchema(schema, dataIndex) || {type: "string"}

        if (! title) {
            col.title = columnSchema.title || dataIndexStr
        }

        // Normalize sortable
        const sortOrder = dataSource.sort?.find(item => 'field' in item && item.field === dataIndexStr) || null;
        col.sortOrder = sortOrder && (sortOrder.dir === 'desc'  ? 'descend' : 'ascend')

        if (! valueType) {
            const schemaType: string = (isArray(columnSchema.type)
                ? columnSchema.type.find(type => type !== 'null')
                : columnSchema.type) as string;

            if (col.valueEnum) {
                valueType = 'select'
            } else if (columnSchema.format && jsonSchemaTypes[columnSchema.format]) {
                valueType = jsonSchemaTypes[columnSchema.format]
            } else if (jsonSchemaTypes[schemaType]) {
                valueType = jsonSchemaTypes[schemaType]
            } else {
                valueType = 'text'
            }
        }

        col.valueType = valueType

        if (! filterable) {
            return col;
        }
        // console.log(dataIndex, col.filteredValue, toJS(dataSource.filter))

        const filterOptions = filterable === true ? {} : filterable;
        const field = filterOptions.field || (dataIndex[0]) as string;

        col.filteredValue = filterValues[field] ? (entries(filterValues[field]) as any[]) : null;

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
        col.renderFormItem = () => filter
        col.filterDropdown = filterDropdown(field, filter)

        return col
    })
}


function initPagination<T extends DataRow, U, ValueType>(
    dataSource: IDataSource<T>,
    propsPagination: TableProps<T>['pagination'],
): ProTableProps<T, FilterValues, ValueType> {
    const paginator = dataSource.paginator;
    if (!paginator) {
        return {pagination: false,}
    }
    if (paginator.type === 'cursor') {
        return {
            pagination: false,
            tableViewRender: (props, defaultDom) => {
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
                                    dataSource.cursor = dataSource.meta.prev_cursor
                                    dataSource.fetch()
                                }}
                                onClickNext={() => {
                                    dataSource.cursor = dataSource.meta.next_cursor
                                    dataSource.fetch()
                                }}
                                onShowSizeChange={(value) => {
                                    dataSource.pageSize = value
                                    dataSource.fetch()
                                }}
                            />
                        }</Observer>
                    </>
                )
            },
        }
    } else {
        return {
            pagination: {
                total: dataSource.total,
                pageSize: dataSource.pageSize,
                current: dataSource.page,
                ...propsPagination
            },
        }
    }
}


const FLAG = undefined
function fromTableFiltersToDSFilters<T extends DataRow>(
    dataSource: IDataSource<T>,
    filters: TableFilters,
) {
    const filters2: (DataSourceFilterItem<T> & { flag: undefined })[] = []
    entries(filters).forEach(([field, values]) => {
        if (! values || !isArray(values)) {
            return ;
        }
        values.filter((filter) => isArray(filter) && filter.length === 2 && ! isEmptyValue(filter[1]))
            .forEach(([operator, value]) => {
            filters2.push({
                field,
                value,
                operator,
                flag: FLAG,
            })
        })
    })

    const baseFilters = dataSource.filter?.filters.filter((item) => Object.keys(item).indexOf('flag') === -1) || []
    const result = baseFilters.concat(filters2)

    return result as DataSourceFilterItem<T>[];
}


export function fromFilterValuesToDSFilters<T extends DataRow>(
    dataSource: IDataSource<T>,
    filters: FilterValues,
) {
    return fromTableFiltersToDSFilters(
        dataSource,
        Object.fromEntries(entries(filters).map(([key, values]) => {
            return [key, entries(values) as [OperatorKeys, any][]]
        }))
    )
}


export function initTable<T extends DataRow, ValueType = "text">(
    dataSource: IDataSource<T>,
    columns: (ProColumnType<T, any> | ColumnType<T>)[],
    autoFetch: boolean,
    propsPagination: TableProps<T>['pagination'],
): ProTableProps<T, FilterValues, ValueType> {

    useEffect(() => {
        if (autoFetch) {
            // console.log(dataSource, 'fetchInit')
            dataSource.fetchInit();
        }
    }, [dataSource, autoFetch])

    return {
        rowKey: '__uuid',
        loading: dataSource.loading,
        dataSource: dataSource.toJS(true),
        columns: normalizeColumns(columns, dataSource),
        onChange: (pagination, filters, sorter, {action}) => {
            switch (action) {
            case "paginate":
                dataSource.page = pagination.current || 1
                dataSource.pageSize = pagination.pageSize
                break;
            case "filter":
                dataSource.setFilters(fromTableFiltersToDSFilters(dataSource, filters as TableFilters))
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
                dataSource.setSort(sort)
                break;
            }
            dataSource.fetch()
        },
        ...initPagination(dataSource, propsPagination),
    }
}


export function filterEmpty(originFilters: FilterValues): FilterValues {
    const filters: FilterValues = {}
    if (isPlainObject(originFilters)) {
        entries(originFilters).forEach(([field, originFilterValue]) => {
            // fieldFilters type: `[op, value][]`
            if (isPlainObject(originFilterValue)) {
                const filterValue: FilterValue = {}

                entries(originFilterValue).forEach(([op, value]) => {
                    if (! isEmptyValue(value)) {
                        filterValue[op as OperatorKeys] = value
                    }
                })
                if (entries(filterValue).length) {
                    filters[field] = filterValue;
                }
            }
        })
    }

    return filters
}
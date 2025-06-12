import React, {useEffect, useRef} from "react";
import {IDataSource} from "@moln/data-source";
import {observer} from "mobx-react-lite";
import AntdProTable, {ProTableProps} from "@ant-design/pro-table";
import {ProColumnType} from "./interfaces";
import {fromDataSourceFilterToFilterValues, fromFilterValuesToDSFilters, initTable} from "./internal/utils";
import {ProFormInstance} from "@ant-design/pro-components";
import {FilterValues} from "../filters/interfaces";
import {observe} from "mobx";
import {schemaToColumns} from "./utils";

interface Props<T extends Record<string, any>, ValueType = 'text'> extends
    Omit<ProTableProps<T, FilterValues, ValueType>, 'columns' | 'dataSource' | 'columnsStateMap' | 'onColumnsStateChange'>
{
    dataSource: IDataSource<T>,
    autoFetch?: boolean,
    columns?: ProColumnType<T, ValueType>[] | undefined,
}

function initSearchable<T extends Record<string, any>, ValueType>(
    dataSource: IDataSource<T>,
    search: ProTableProps<T, FilterValues, ValueType>['search'],
    columns: ProColumnType<T, ValueType>[],
): ProTableProps<T, FilterValues, ValueType> {
    const form = useRef<ProFormInstance>();

    useEffect(() => {
        if (!search) {
            return;
        }
        return observe(dataSource, "filter", (change) => {
            form.current?.setFieldsValue(fromDataSourceFilterToFilterValues(dataSource.filter))
        })
    }, [search])

    if (search) {
        columns.forEach((col) => {
            col.search = col.filterable ? col.search : false
            col.filterDropdown = undefined
        })

        return {
            formRef: form,
            onSubmit: (params) => {
                dataSource.setFilters(fromFilterValuesToDSFilters(dataSource, params))
                dataSource.fetch()
            }
        }
    } else {
        return {
            formRef: form,
        }
    }
}


function ProTable<T extends Record<string, any>, ValueType = 'text'>({
    dataSource,
    columns = schemaToColumns(dataSource.schema.schema) as any[],
    autoFetch = true,
    defaultSize,
    pagination,
    ...props
}: Props<T, ValueType>) {

    const baseProps = initTable<T, ValueType>(dataSource, columns, autoFetch, pagination)
    const searchProps = initSearchable(dataSource, props.search, baseProps.columns!)

    return (
        <AntdProTable<T, FilterValues, ValueType>
            options={{
                reload: () => dataSource.fetch(),
            }}
            search={false}
            {...searchProps}
            {...baseProps}
            {...props}
        />
    )
}


export default observer(ProTable);

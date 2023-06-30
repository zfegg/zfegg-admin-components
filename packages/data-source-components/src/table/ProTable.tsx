import React, {useMemo} from "react";
import {IDataSource} from "@moln/data-source";
import {observer} from "mobx-react";
import AntdProTable, {ColumnsState, ProTableProps} from "@ant-design/pro-table";
import {ParamsType} from "@ant-design/pro-provider";
import {ProColumnType} from "./interfaces";
import {BindRoute, initTable} from "./internal/table";

interface Props<T extends Record<string, any>, U extends ParamsType, ValueType = 'text'> extends
    Omit<ProTableProps<T, U, ValueType>, 'columns' | 'dataSource' | 'columnsStateMap' | 'onColumnsStateChange'>
{
    dataSource: IDataSource<T>,
    autoFetch?: boolean,
    columns?: ProColumnType<T, ValueType>[] | undefined,
    bindRoute?: BindRoute,
}

const genColumnKey = (key?: (string | number) | (string | number)[], index?: number): string => {
    if (key) {
        return Array.isArray(key) ? key.join('-') : key.toString();
    }
    return `${index}`;
};

function ProTable<T extends Record<string, any>, U extends ParamsType, ValueType = 'text'>({
    columns,
    dataSource,
    autoFetch = true,
    bindRoute = false,
    defaultSize,
    pagination,
    ...props
}: Props<T, U, ValueType>) {

    const baseProps: Record<string, any> = initTable(dataSource, columns, bindRoute, autoFetch, pagination)

    const defaultColumnsStateMap = useMemo(() => {
        const columnsStateMap: Record<string, ColumnsState> = {}
        columns?.forEach((col, index) => {
            if (col.defaultState) {
                return columnsStateMap[genColumnKey(col.key || col.dataIndex, index)] = col.defaultState
            }
        })
        return columnsStateMap
    }, [columns])

    return (
        <AntdProTable<T, U, ValueType>
            options={{
                reload: () => dataSource.fetch(),
            }}
            search={false}
            columnsState={{
                defaultValue: defaultColumnsStateMap
            }}
            {...baseProps}
            {...props}
        />
    )
}

export default observer(ProTable);

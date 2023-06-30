import React from "react";
import {Table as AntdTable, TableProps} from "antd";
import {IDataSource} from "@moln/data-source";
import {observer} from "mobx-react";
import {ColumnType} from "./interfaces";
import {BindRoute, initTable,} from "./internal/table";

interface Props<T extends Record<string, any>> extends Omit<TableProps<T>, 'dataSource'> {
    dataSource: IDataSource<T>,
    autoFetch?: boolean,
    columns: ColumnType<T>[],
    bindRoute?: BindRoute,
}
function Table<T extends object = any>({
    dataSource,
    autoFetch = true,
    columns,
    bindRoute = false,
    pagination,
    ...props
}: Props<T>) {

    const baseProps = initTable(dataSource, columns, bindRoute, autoFetch, pagination)

    return (
        <AntdTable<T>
            {...baseProps as any[]}
            {...props}
        />
    )
}

export default observer(Table);

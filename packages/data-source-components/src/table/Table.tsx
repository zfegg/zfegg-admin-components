import React from "react";
import {Table as AntdTable, TableProps} from "antd";
import {IDataSource} from "@moln/data-source";
import {observer} from "mobx-react-lite";
import {ColumnType} from "./interfaces";
import {initTable} from "./internal/utils";

interface Props<T extends Record<string, any>> extends Omit<TableProps<T>, 'dataSource'> {
    dataSource: IDataSource<T>,
    autoFetch?: boolean,
    columns: ColumnType<T>[],
}
function Table<T extends object = any>({
    dataSource,
    autoFetch = true,
    columns,
    pagination,
    ...props
}: Props<T>) {

    const baseProps = initTable<T>(dataSource, columns, autoFetch, pagination)

    return (
        <AntdTable<T>
            {...baseProps as any[]}
            {...props}
        />
    )
}

export default observer(Table);

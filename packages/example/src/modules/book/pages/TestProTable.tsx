import React, {Component, FC, useMemo, useState} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Button, Space} from "antd";
import {
    DeleteButton,
    FormDrawer,
    ProColumnType,
    ProTable,
    useDataSource,
    useDataSourceBindSearch,
    useDrawerState,
} from "@zfegg/admin-data-source-components";
import {injectServices} from "@moln/react-ioc";
import {DataSource, Resources} from "@moln/data-source";
import {EditOutlined} from "@ant-design/icons";
import {Book} from "../models/book";
import {Permission} from "@zfegg/admin-layout";

interface CardProps {
    dataSource: DataSource<Book>,
}


const TestProTable: FC = () => {

    const {drawerProps, setItemId} = useDrawerState()

    const dataSource = useDataSource<Book>('book/books', {paginator: {pageSize: 3}})

    const columns: ProColumnType<Book>[] = [
        {
            dataIndex: 'id',
            fixed: 'left',
        },
        {
            dataIndex: 'name',
            filterable: {
                operators: ['contains', 'eq']
            },
        },
        {
            dataIndex: 'barcode',
            filterable: true,
            sorter: true,
            defaultSortOrder: 'descend'
        },
        {
            dataIndex: 'created_at',
            filterable: true,
            sorter: true,
        },
        {
            dataIndex: ['group', 'name'],
            filterable: true,
        },
        {
            dataIndex: 'status',
            filterable: true,
        },
        {
            title: '操作',
            key: 'actions',
            render: (_, row) => {
                return (
                    <Space>
                        <Button size={"small"}
                            onClick={() => {
                                setItemId(row.id)
                            }}
                            type={"primary"}
                            icon={<EditOutlined />}
                        />
                        <Permission name={"书本管理/Table/删除"} >
                            <DeleteButton
                                dataSource={dataSource}
                                item={row}
                                size={'small'}
                                onDeleted={() => {
                                    dataSource.fetch();
                                }}
                            />
                        </Permission>
                    </Space>
                )
            },
        }
    ];
    useDataSourceBindSearch(dataSource)

    return (
        <PageContainer extra={[
            <Button key={"add"} type={"primary"} onClick={() => {
               setItemId(undefined)
            }}>新增</Button>
        ]} >
            <ProTable
                autoFetch={false}
                defaultSize={'small'}
                columns={columns}
                dataSource={dataSource}
            />

            <FormDrawer
                {...drawerProps}
                dataSource={dataSource}
            />
        </PageContainer>
    );
}
export default TestProTable
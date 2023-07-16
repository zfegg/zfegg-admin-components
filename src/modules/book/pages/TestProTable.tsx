import React, {Component, useMemo} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Button, Space} from "antd";
import {DeleteButton, FormDrawer, ProColumnType, ProTable,} from "@zfegg/admin-data-source-components";
import {injectServices} from "@moln/react-ioc";
import {DataSource, Resources} from "@moln/data-source";
import {EditOutlined} from "@ant-design/icons";
import {Book} from "../models/book";
import {Permission} from "@zfegg/admin-admin";

interface CardProps {
    dataSource: DataSource<Book>,
}

const injection = injectServices((container) => {
    console.log('inject mock data')

    const dataSource = useMemo(() => {
        console.log('init mock data')
        return container.get(Resources).create('book/books').createDataSource({paginator: {pageSize: 3}})
    }, [])

    return {dataSource}
})

class TestProTable extends Component<CardProps> {

    state = {
        visible: false,
        itemId: undefined
    }

    handleRemove = async (row: Book) => {
        const {dataSource} = this.props;
        dataSource.remove(dataSource.get(row.id)!)
        await dataSource.sync();
        await dataSource.fetch();
    }

    render() {

        const {visible, itemId} = this.state;
        const {dataSource} = this.props;
        console.log('render TestProTable')

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
                dataIndex: 'group_id',
                filterable: true,
                defaultState: {
                    show: false,
                },
            },
            {
                dataIndex: 'enabled',
                filterable: true,
                defaultState: {
                    show: false,
                },
            },
            {
                title: '操作',
                key: 'actions',
                render: (_, row) => {
                    return (
                        <Space>
                            <Button size={"small"}
                                onClick={() => this.setState({visible: true, itemId: row.id})}
                                type={"primary"}
                                icon={<EditOutlined />}
                            />
                            <Permission name={"书本管理/Table/删除"} >
                                <DeleteButton value={row.id}
                                    dataSource={dataSource}
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

        return (
            <PageContainer extra={[
                <Button key={"add"} type={"primary"} onClick={() => this.setState({visible: true, itemId: undefined})}>新增</Button>
            ]} >
                <ProTable
                    bindRoute
                    defaultSize={'small'}
                    columns={columns}
                    dataSource={dataSource}
                />

                <FormDrawer visible={visible}
                    itemId={itemId}
                    onClose={(...args) => {
                        console.log(args)
                        this.setState({visible: false});
                    }}
                    dataSource={dataSource}
                />
                {/*<FormT />*/}
            </PageContainer>
        );
    }
}

export default injection(TestProTable)
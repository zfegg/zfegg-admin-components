import React, {Component, useMemo} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Button, Space} from "antd";
import {DeleteButton, FormDrawer, ProColumnType, ProTable,} from "@zfegg/admin-data-source-components";
import {injectServices} from "@moln/react-ioc";
import {DataSource, Resources} from "@moln/data-source";
import {RouteConfigComponentProps} from "react-router-config";
import {EditOutlined} from "@ant-design/icons";
import {Book} from "../models/book";

interface CardProps extends RouteConfigComponentProps {
    dataSource: DataSource<Book>,
}

const injection = injectServices((container) => {
    console.log('inject mock data')

    const dataSource = useMemo(() => {
        console.log('init mock data')
        return container.get(Resources).create('book/books2').createDataSource({paginator: {type: "cursor"}})
    }, [])

    return {dataSource}
})

class CursorPaginationTable extends Component<CardProps> {

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
                            <DeleteButton value={row.id}
                                dataSource={dataSource}
                                size={'small'}
                                onDeleted={() => {
                                    dataSource.fetch();
                                }}
                            />
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
                    pagination={{
                        pageSizeOptions: ['3', '10', '20',]
                    }}
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

export default injection(CursorPaginationTable)
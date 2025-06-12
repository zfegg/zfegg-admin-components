import React, {Component, useMemo} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Button, Card, Space} from "antd";
import {ColumnType, DeleteButton, FormDrawer, Table,} from "@zfegg/admin-data-source-components";
import {injectServices} from "@moln/react-ioc";
import {DataSource, IDataSource, Resources} from "@moln/data-source";
import {EditOutlined} from "@ant-design/icons";
import {Book} from "../models/book";

interface CardProps {
    dataSource: DataSource<Book>,
}

const data: Record<any, any>[] = []
for (let i = 1; i < 100; i++) {
    data.push({
        name: 'test' + i,
        barcode: i,
        group: i % 10,
        created_at: (new Date(1609459200000 + i * 86400000)).toISOString(),
        enabled: !(i % 2),
    })
}

const dataSourceDelayFetch = (ds: IDataSource<any>) => {
    const rawFetch = ds.dataProvider.fetch.bind(ds.dataProvider)
    ds.dataProvider.fetch = async (params) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        console.log('ddd')
        return rawFetch(params)
    }
}

const injection = injectServices((container) => {
    console.log('inject mock data')

    const dataSource = useMemo(() => {
        console.log('init mock data')
        // const ds = container.get(Resources).createDataSource(data, {schemaId: 'book/books'})
        const ds = container.get(Resources).createDataSource('book/books')
        console.log(ds)
        dataSourceDelayFetch(ds)
        return ds
    }, [])

    return {dataSource}
})

let groupEnum = new Map()

for (let i = 0; i < 10; i++) {
    groupEnum.set(i, `@${i}`)
}

class TestTable extends Component<CardProps> {

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
        console.log('render TestTable')

        const columns: ColumnType<Book>[] = [
            {
                dataIndex: 'id',
            },
            {
                dataIndex: 'name',
                filterable: true,
            },
            {
                dataIndex: 'barcode',
                filterable: true,
                sorter: true,
            },
            {
                dataIndex: 'created_at',
                filterable: true,
                sorter: true,
            },
            {
                dataIndex: 'group',
                filterable: true,
                valueEnum: groupEnum,
            },
            {
                dataIndex: 'enabled',
                filterable: true,
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
                            <DeleteButton size={"small"} dataSource={dataSource} item={row} />
                        </Space>
                    )
                },
            }
        ]

        return (
            <PageContainer extra={[
                <Button key={"add"} type={"primary"} onClick={() => this.setState({visible: true, itemId: undefined})}>新增</Button>
            ]} >
                <Card>
                    <Table
                        size={"small"}
                        columns={columns}
                        dataSource={dataSource}
                    />
                </Card>
                <FormDrawer visible={visible} itemId={itemId} onClose={() => this.setState({visible: false})} dataSource={dataSource} />
                {/*<FormT />*/}
            </PageContainer>
        );
    }
}

export default injection(TestTable)
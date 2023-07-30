import React, {Component, useMemo} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Button, Space} from "antd";
import {
    ColumnType, DeleteButton,
    FormDrawer,
    Table,
} from "@zfegg/admin-data-source-components";
import {injectServices} from "@moln/react-ioc";
import {ArrayProvider, DataSource, Query, Schema} from "@moln/data-source";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {Book} from "../models/book";
import Ajv from "ajv";

interface CardProps {
    dataSource: DataSource<Book>,
}

const data: Record<any, any>[] = []
for (let i = 1; i < 100; i++) {
    let day = (i % 30) + '';
    day = day.length === 1 ? '0' + day : day;
    data.push({
        name: 'test' + i,
        barcode: i,
        group: i % 10,
        created_at: `2021-01-${day} 01:01:01`,
        enabled: !(i % 2),
    })
}

class Ar extends ArrayProvider {
    fetch(params: any): Promise<any> {

        const page = params?.page;
        const pageSize = params?.pageSize;

        let data = new Query(this.data);

        if (params?.sort) {
            data = data.order(params.sort)
        }
        if (params?.filter) {
            data = data.filter(params.filter)
        }

        if (!page || !pageSize) {
            return Promise.resolve({
                data: data.toArray(),
                total: this.data.length,
            });
        }

        return new Promise((resolve) => {
            const start = (page - 1) * pageSize;
            setTimeout(() => {
                console.log('data resolved')
                resolve({
                    data: data.range(start, pageSize).toArray(),
                    total: data.toArray().length,
                })
            }, 500)
        })
    }
}

const injection = injectServices((container) => {
    console.log('inject mock data')

    const dataSource = useMemo(() => {
        console.log('init mock data')
        const schema = new Schema(container.get(Ajv), 'book/books');
        return (new Ar(data, schema)).createDataSource()
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
                <Table
                    size={"small"}
                    columns={columns}
                    dataSource={dataSource}
                />
                <FormDrawer visible={visible} itemId={itemId} onClose={() => this.setState({visible: false})} dataSource={dataSource} />
                {/*<FormT />*/}
            </PageContainer>
        );
    }
}

export default injection(TestTable)
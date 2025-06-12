import {PageContainer} from "@ant-design/pro-layout";
import React, {FC, useMemo, useState} from "react";
import {Button, Form, Input, Space} from "antd";
import {
    DeleteButton,
    FormDrawer,
    ProColumnType,
    ProTable,
    valueEnumToOptions
} from "@zfegg/admin-data-source-components";
import {useService} from "@moln/react-ioc";
import {Resources} from "@moln/data-source";
import {EditOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import ProjectAvatar from "../components/ProjectAvatar";

const statusEnum =  new Map([
    [0, {text: '关闭', 'color': 'error'}],
    [1, {text: '启用', 'color': 'success'}],
])

const AdminProjectList: FC = () => {

    const [visible, setVisible] = useState(false)
    const [itemId, setItemId] = useState<number>()
    const resources = useService(Resources);
    const dataSource = useMemo(() => resources.createDataSource('projects'), [resources]);

    const columns: ProColumnType[] = [
        {
            dataIndex: 'id',
            title: '#',
        },
        {
            dataIndex: 'name',
            filterable: true,
            render: (dom, row) => <Link to={`/projects/${row.id}/home`}><ProjectAvatar project={row} showName /></Link>
        },
        {
            dataIndex: 'code',
            filterable: true,
        },
        {
            dataIndex: 'created_at',
            valueType: 'dateTime',
            width: 150,
        },
        {
            dataIndex: 'status',
            filterable: true,
            width: 120,
            valueEnum: statusEnum,
        },
        {
            title: '操作',
            key: 'actions',
            width: 120,
            render: (_, row) => {
                return (
                    <Space>
                        <Button
                            size={"small"}
                            onClick={() => {
                                setVisible(true);
                                setItemId(row.id)
                            }}
                            type={"primary"}
                            icon={<EditOutlined />}
                        />
                        <DeleteButton size={"small"} dataSource={dataSource} item={row} />
                    </Space>
                )
            },
        }
    ];

    return (
        <PageContainer extra={[
            <Button key={"add"} type={"primary"} onClick={() => {
                setVisible(true)
                setItemId(undefined)
            }}>新增</Button>,
        ]} >
            <ProTable
                defaultSize={"small"}
                columns={columns}
                dataSource={dataSource}
            />
            <FormDrawer {...{
                visible,
                itemId,
                onClose: () => setVisible(false),
                dataSource,
                uiProps: {
                    description: {
                        span: 24,
                        render: (props) => (
                            <Form.Item {...props}>
                                <Input.TextArea />
                            </Form.Item>
                        )
                    },
                    status: {
                        enumOptions: valueEnumToOptions(statusEnum)
                    }
                }
            }}
            />
        </PageContainer>
    );
}

export default AdminProjectList

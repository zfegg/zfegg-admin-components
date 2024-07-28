import {Button, Card, Form, Input, Select, Table, TableColumnsType} from "antd";
import React, {ComponentProps, FC, useMemo, useState} from "react";
import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import {useService} from "@moln/react-ioc";
import {IDataSource, Resources} from "@moln/data-source";
import {
    filterSchemaByProperties,
    FormDrawer,
    ProColumnType,
    ProTable,
    valueEnumToOptions
} from "@zfegg/admin-data-source-components";
import {PageContainer} from "@ant-design/pro-layout";
import {observer} from "mobx-react";
import RoleTag from "../components/RoleTag";
import {Binding, IConfigProvider, IUser} from "../interfaces";
import RoleSelect from "../components/RoleSelect";
import {addUserSchema, CONFIG_KEY, Status, STATUS_TEXT} from "../constants";
import {useRequest} from "ahooks";

const EnableButton: FC<{ users: IDataSource<IUser>, row: IUser }> = observer(({users, row}) => {

    const [loading, setLoading] = useState(false)

    return <Button
        loading={loading}
        danger={row.status === Status.enabled}
        onClick={async () => {
            const u = users.get(row.id)!
            u.status = row.status === Status.disabled ? Status.enabled : Status.disabled
            setLoading(true)
            try {
                await users.sync()
            } catch (e) {
                users.cancelChanges()
            } finally {
                setLoading(false)
            }
        }}
    >
        {row.status === Status.disabled ? '启用' : '禁用'}
    </Button>
})


const UnbindButton = ({users, row}: { users: IDataSource<IUser>, row: Binding & { user: IUser } }) => {
    const [loading, setLoading] = useState(false)

    return (
        <Button
            size={"small"}
            danger
            loading={loading}
            onClick={async () => {
                setLoading(true)
                try {
                    await users.dataProvider.update(
                        row.user.id,
                        {
                            bindings: row.user.bindings.filter(item => item.id !== row.id).map(item => item.id) as any
                        }
                    )
                    users.fetch()
                } finally {
                    setLoading(false)
                }
            }}
        >解绑</Button>
    )
};



const UserForm: FC<ComponentProps<typeof FormDrawer> & {fields: string[]}> = (props) => {
    const users = props.dataSource as IDataSource<IUser>
    const {fields, itemId} = props

    const {runAsync: queryEmailExists, cancel} = useRequest(async (value: string) => {
        const result = await users.dataProvider.fetch({
            filter: {
                filters: [{
                    field: "email",
                    operator: "eq",
                    value
                }]
            }
        })
        return !!result.data.length
    }, {
        debounceWait: 300,
        manual: true
    });

    const schema = itemId ? users.schema.schema : addUserSchema

    return (
        <FormDrawer
            {...props}
            schema={filterSchemaByProperties(schema, fields)}
            normalize={(obj) => {
                return {
                    ...obj,
                    roles: (obj as IUser).roles.map(r => r.id),
                }
            }}
            uiProps={{
                email: {
                    render: (props) => (
                        <Form.Item
                            {...props}
                            rules={[
                                ...props.rules,
                                {type: "email"},
                                {validator: async (_, value) => {
                                    if (! value) {
                                        return true;
                                    }
                                    if (itemId && users.get(itemId)?.email === value) {
                                        return true;
                                    }

                                    cancel();
                                    const result = await queryEmailExists(value);
                                    if (result) {
                                        throw new Error("邮箱已被注册")
                                    }
                                    return true;
                                }}
                            ]}
                            normalize={(value) => value ? value : null}
                        >
                            <Input type={"email"} />
                        </Form.Item>
                    )
                },
                password: {
                    component: <Input.Password/>,
                },
                status: {
                    component: <Select options={valueEnumToOptions(STATUS_TEXT)}/>,
                },
                roles: {
                    component: <RoleSelect />,
                }
            }}
        />
    )
}

export default () => {

    const resources = useService(Resources);
    const assignRoleDisabled = useService<Record<string, IConfigProvider>>('config')[CONFIG_KEY].assignRoleDisabled
    const users = useMemo(() => resources.create<IUser>('admin/users').createDataSource(), [])
    const [visible, setVisible] = useState(false);
    const [itemId, setItemId] = useState<number>();
    const columns: ProColumnType<IUser>[] = [
        {
            dataIndex: 'id',
            width: 48,
            title: '#',
        },
        {
            title: '邮箱',
            filterable: true,
            dataIndex: 'email',
        },
        {
            dataIndex: 'real_name',
            filterable: {
                operators: ['contains', 'startswith', 'eq'],
            },
        },
        {
            dataIndex: 'roles',
            render: (_, row) => <RoleTag roles={row.roles}/>
        },
        {
            dataIndex: 'admin',
            filterable: true,
            valueEnum: new Map([
                [true, '是'],
                [false, '否'],
            ]) as any,
        },
        {
            dataIndex: 'created_at',
            valueType: 'dateTime',
        },
        {
            dataIndex: 'updated_at',
            valueType: 'dateTime',
        },
        {
            dataIndex: 'status',
            filterable: true,
            valueEnum: STATUS_TEXT,
        },
        {
            key: 'actions',
            title: '操作',
            valueType: 'option',
            render: (__, row) => [
                <Button
                    key="editable"
                    icon={<EditOutlined/>}
                    onClick={() => {
                        setItemId(row.id);
                        setVisible(true)
                    }}
                    type={"primary"}
                >
                </Button>,
                <EnableButton key="disable" users={users} row={row}/>,
            ],
        },
    ];

    const bindingColumns: TableColumnsType<Binding & {user: IUser}> = [
        {dataIndex: 'provider', title: '绑定', render: (_, row) => row.provider},
        {dataIndex: ['info', 'username'], title: '账号',},
        {dataIndex: 'created_at', title: '绑定时间'},
        {
            key: "actions",
            title: '操作',
            render: (_, row) => {
                return (<UnbindButton row={row} users={users} />)
            }
        }
    ]
    const fields = ['email', 'real_name', 'status', 'admin', 'password', 'roles'];

    // 禁用角色分配功能
    if (assignRoleDisabled) {
        fields.pop()
        const idx = columns.findIndex((c) => c.dataIndex === "roles");
        columns.splice(idx, 1)
    }

    return (
        <PageContainer extra={[
            <Button key="add" icon={<PlusOutlined/>}
                type="primary"
                onClick={() => {
                    setItemId(undefined)
                    setVisible(true)
                }}
            >
                新建
            </Button>,
        ]}>
            <ProTable
                columns={columns}
                dataSource={users}
                expandable={{
                    expandedRowRender: (row) => (
                        <Card size={"small"}>
                            <Table
                                columns={bindingColumns}
                                dataSource={row.bindings.map(item => ({...item, user: row}))}
                                pagination={false}
                                bordered
                                rowKey={'id'}
                                size={"small"}
                            />
                        </Card>
                    ),
                    rowExpandable: row => row.bindings.length > 0,
                }}
            />
            <UserForm
                visible={visible}
                itemId={itemId}
                onClose={() => setVisible(false)}
                dataSource={users as IDataSource}
                fields={fields}
            />
        </PageContainer>
    );
};

import {Avatar, Button, Divider, Form, List, notification, Popconfirm, Space, Tree, TreeProps} from "antd";
import React, {FC, useEffect, useMemo, useState} from "react";
import {PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {useService} from "@moln/react-ioc";
import {IDataSource, IModelT, Resources} from "@moln/data-source";
import {PageContainer} from "@ant-design/pro-layout";
import ProCard from "@ant-design/pro-card";
import {observer} from "mobx-react-lite";
import {IConfigProvider, IRole, IUser} from "../interfaces";
import {UserAvatar} from "@zfegg/admin-layout";
import {filterSchemaByProperties, FormDrawer, useDataSource} from "@zfegg/admin-data-source-components";
import styles from './RoleList.module.less'
import UserSelect from "../components/UserSelect";
import {CONFIG_KEY} from "../constants";

type DataNode = Exclude<TreeProps['treeData'], undefined>[0]

const RoleMembers: FC<{role: IModelT<IRole>, roles: IDataSource<IRole>}> = ({role, roles}) => {
    const [form] = Form.useForm();
    const resources = useService(Resources);
    const users = useMemo(() => resources.createDataSource<IRole>('admin/users', {paginator: false}), [])
    const roleUsers = useMemo(() => resources.create<IUser>(`admin/roles/${role.id}/users`), [role])
    const [submitting, setSubmitting] = useState(false)

    const onFinish = async ({users}: {users: number[]}) => {
        setSubmitting(true)
        for (const id of users) {
            await roleUsers.create({id})
        }
        setSubmitting(false)
        await roles.fetch()
        form.resetFields()
    }

    return (
        <ProCard title={`<${role.name}>成员`}
            extra={[
                <span key={'info'} style={{color: ''}}>总数: {role.users.length}</span>
            ]}
            headerBordered
        >
            <Form form={form} onFinish={onFinish} >
                <Form.Item name={'users'} label={'邀请用户'}>
                    <UserSelect />
                </Form.Item>
                <Form.Item>
                    <Button loading={submitting} type={"primary"} htmlType={"submit"}>确认</Button>
                </Form.Item>
            </Form>
            <Divider />
            <List<IUser>
                loading={users.loading}
                dataSource={role.users}
                renderItem={item => (
                    <List.Item
                        extra={[
                            <Button key="del" type={'link'} danger
                                onClick={async () => {
                                    await roleUsers.remove(item.id)
                                    roles.fetch()
                                }}
                            >删除</Button>,
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatar}>{item.real_name[0]}</Avatar>}
                            title={item.real_name}
                            description={item.email}
                        />
                    </List.Item>
                )}
            />
        </ProCard>
    )
}

interface IMenu {
    name: string
    children?: IMenu[]
    permissions: string[]
}

const toTreeData = (menus: IMenu[], parents: string[] = []): DataNode[] =>  {
    return menus.map(({name, permissions, children}) => {
        const keys = parents.concat(name)
        const key = keys.join('/');
        return {
            title: name,
            key,
            permissions,
            children: children ? toTreeData(children, keys) : undefined
        }
    })
}

const RolePermissions: FC<{role: IModelT<IRole>, roles: IDataSource<IRole>}> = observer(({role, roles}) => {
    const resources = useService(Resources)
    const dataSource = useMemo(() => resources.create<IMenu>('admin/menus'), [])
    const [treeData, setTreeData] = useState<DataNode[]>()


    useEffect(() => {
        (async () => {
            const result = await dataSource.fetch()
            setTreeData(toTreeData(result.data))
        })()
    }, [])

    return (
        <ProCard title={`<${role.name}>权限菜单`}
            headerBordered
            extra={(
                <Space>
                    <Button key={'reset'}
                        icon={<SaveOutlined />}
                        ghost
                        disabled={! role.isPropertyDirty('menus')}
                        onClick={() => {
                            role.resetProperty('menus');
                        }}
                    >重置</Button>
                    <Button key={'save'} icon={<SaveOutlined />}
                        type={'primary'}
                        loading={roles.loadings.syncing}
                        disabled={! role.isPropertyDirty('menus')}
                        onClick={async () => {
                            await roles.sync();
                            notification.success({message: '操作成功'})
                        }}
                    >保存</Button>
                </Space>
            )}
        >
            {treeData && (
                <Tree
                    checkable
                    checkedKeys={role.menus}
                    selectable={false}
                    defaultExpandAll
                    onCheck={(_, {checkedNodes}) => {
                        role.menus = checkedNodes.filter(n => !n.children).map(n => n.key) as string[]

                        console.log(checkedNodes, role.menus);
                    }}
                    treeData={treeData}
                />
            )}
        </ProCard>
    )
})

export default observer(() => {

    // const resources = useService(Resources);
    // 禁用角色分配功能
    const assignRoleDisabled = useService<Record<string, IConfigProvider>>('config')[CONFIG_KEY].assignRoleDisabled
    const roles = useDataSource<IRole>('admin/roles', {paginator: false})
    // const roles = useMemo(() => resources.createDataSource<IRole>('admin/roles', {paginator: false}), [])
    const [visible, setVisible] = useState(false);
    const [roleId, setRoleId] = useState<number>();
    const [selectedRole, setSelectedRole] = useState<number>();

    useEffect(() => {
        roles.fetchInit()
    }, [])

    const role = roles.get(selectedRole!)

    return (
        <PageContainer>
            <ProCard split="vertical">
                <ProCard title="角色"
                    headerBordered
                    colSpan={8}
                    extra={[
                        <Button key={'add'} icon={<PlusOutlined />} type={'primary'}
                            onClick={() => {
                                setRoleId(undefined)
                                setVisible(true)
                            }}
                        >添加</Button>
                    ]}
                >
                    <List<IModelT<IRole>>
                        loading={roles.loading}
                        itemLayout="vertical"
                        dataSource={roles.data}
                        renderItem={item => (
                            <List.Item
                                className={[styles.roleItem, selectedRole === item.id ? styles.active : null].join(' ')}
                                onClick={() => {
                                    setSelectedRole(item.id)
                                }}
                                extra={[
                                    <Button key={'edit'} type={'link'} onClick={() => {setRoleId(item.id); setVisible(true)}}>编辑</Button>,
                                    <Popconfirm title={'确认删除?'} key="del"
                                        onConfirm={async () => {
                                            setSelectedRole(undefined)
                                            roles.remove(item)
                                            await roles.sync()
                                            await roles.fetch()
                                        }}
                                    >
                                        <Button type={'link'} danger>删除</Button>
                                    </Popconfirm>,
                                ]}
                            >
                                <List.Item.Meta
                                    title={item.name}
                                    description={item.description}
                                />
                                <Avatar.Group maxCount={5}>
                                    {item.users.slice(0, 6).map((u) => (<UserAvatar key={u.id} size={"default"} user={u} />))}
                                </Avatar.Group>
                            </List.Item>
                        )}
                    />
                </ProCard>
                {role && <RolePermissions role={role} roles={roles} />}
                {role && !assignRoleDisabled && <RoleMembers role={role} roles={roles} />}
            </ProCard>
            <FormDrawer visible={visible}
                itemId={roleId}
                onClose={() => {setRoleId(undefined); setVisible(false)}}
                dataSource={roles}
                schema={filterSchemaByProperties(roles.schema.schema, ['name', 'description'])}
                uiProps={{
                    description: {
                        span: 24
                    }
                }}
            />
        </PageContainer>
    );
});

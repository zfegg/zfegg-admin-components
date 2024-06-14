import React, {FC, useEffect, useMemo, useState} from "react";
import {useService} from "@moln/react-ioc";
import {Resources} from "@moln/data-source";
import {Observer} from "mobx-react";
import {Button, DatePicker, Drawer, Form, Space, Tag} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {UserAvatar} from "@zfegg/admin-layout";
import {Group, Member, ProjectParam} from "../interfaces";
import {DeleteButton, FormDrawer, ProColumnType, ProTable} from "@zfegg/admin-data-source-components";
import {useParams} from "react-router-dom";
import {EditOutlined} from "@ant-design/icons";
import ProjectMemberSelect from "../components/ProjectMemberSelect";
import AllUserSelect from "../components/AllUserSelect";
import AllRoleSelect from "../components/AllRoleSelect";

interface MemberForm {
    members: number[],
    roles: number[],
    expired?: string | null
}

interface InviteFormProps {
    onSubmit: (values: MemberForm) => Promise<void>,
    onClose: () => void,
    open: boolean,
}

const InviteForm: FC<InviteFormProps> = ({onSubmit, ...drawerProps}) => {
    const initValues: MemberForm = {members:[], roles: []};
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();

    return (
        <Drawer
            title="邀请成员"
            width={600}
            bodyStyle={{paddingBottom: 80}}
            footer={
                <Space>
                    <Button loading={submitting} onClick={() => form.submit()} type="primary">
                        确认
                    </Button>
                </Space>
            }
            {...drawerProps}
        >
            <Form layout={"vertical"} form={form} initialValues={initValues} onFinish={async (value) => {
                setSubmitting(true)
                await onSubmit(value)
                form.resetFields()
                setSubmitting(false)
            }}>
                <Form.Item name={'members'} label="成员" style={{minWidth: 200}}>
                    <AllUserSelect />
                </Form.Item>
                <Form.Item name={'roles'} label="角色" style={{minWidth: 200}}>
                    <AllRoleSelect />
                </Form.Item>
                <Form.Item name={'expired'} label="过期时间" style={{minWidth: 200}}>
                    <DatePicker showTime />
                </Form.Item>
            </Form>
        </Drawer>
    )
}

// interface GroupedMember extends User {
//     roles: (IRole & {bind_id: number})[]
// }
//
// function groupMembers(members: IMember[]): GroupedMember[] {
//     const data: { [key in number]: GroupedMember } = {};
//     members.forEach((item) => {
//         let member: GroupedMember;
//         if ( data[item.member.id]) {
//             member = data[item.member.id];
//             member.roles.push({
//                 ...item.role,
//                 bind_id: item.id
//             })
//         } else {
//             member = {
//                 ...item.member,
//                 roles: [
//                     {
//                         ...item.role,
//                         bind_id: item.id
//                     }
//                 ]
//             };
//         }
//         data[item.member.id] = member;
//     });
//
//     return Object.entries(data).map(([key, item]) => item);
// }

const Members: FC = () => {

    const tabList = [
        {
            tab: "成员角色",
            key: 'members'
        },
        {
            tab: '成员分组',
            key: "groups"
        }
    ];
    const tabs: Record<string, any> = {
        members: <MemberList />,
        groups: <GroupList />,
    }
    const [tab, setTab] = useState("members")

    return (
        <PageContainer
            tabList={tabList}
            tabActiveKey={tab}
            onTabChange={(key) => {
                setTab(key)
            }}
        >
            {tabs[tab!]}
        </PageContainer>
    );
};

const GroupList: FC = () => {
    const {project} = useParams() as ProjectParam
    const [visible, setVisible] = useState(false)
    const [itemId, setItemId] = useState<number>()
    const resources = useService(Resources)
    const dataSource = useMemo(
        () => resources
            .create<Group>('projects/{project}/groups', {project})
            .createDataSource({paginator: false}),
        []
    )

    const columns: ProColumnType<Group>[] = [
        {
            title: '#',
            dataIndex: "id",
            width: 120,
        },
        {
            title: '名称',
            dataIndex: "name",
        },
        {
            title: "成员",
            dataIndex: 'members',
            render: (_, row) => (
                <Space direction={"vertical"}>
                    {row.members.map((item) => <UserAvatar key={item.id} user={item} showName />)}
                </Space>
            )
        },
        {
            title: '操作',
            width: 200,
            render: (_, row) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => {
                        setItemId(row.id)
                        setVisible(true)
                    }} >编辑</Button>
                    <DeleteButton size={"small"} dataSource={dataSource} item={row} />
                </Space>
            )
        }
    ];

    return (
        <>
            <FormDrawer {...{
                visible,
                itemId,
                onClose: () => setVisible(false),
                dataSource,
                normalize: ({members, ...data}: Group) => {
                    return {
                        ...data,
                        members: members?.map(item => item.id)
                    }
                },
                uiProps: {
                    members: {
                        span: 24,
                        render: (name) => (
                            <Form.Item name={name} label={'成员'} rules={[{required: true}]}>
                                <ProjectMemberSelect mode={"multiple"} />
                            </Form.Item>
                        )
                    },
                    // status: {
                    // }
                },
            }}
            />
            <ProTable dataSource={dataSource}
                size={"small"}
                columns={columns}
                toolBarRender={() => [
                    <Button key={'add'} onClick={() => {
                        setItemId(undefined)
                        setVisible(true)
                    }} type="primary">新建分组</Button>
                ]}
            />
        </>
    )
}

const MemberList: FC = () => {
    const {project} = useParams() as ProjectParam

    const [visible, setVisible] = useState(false)
    const resources = useService(Resources)
    const membersApi = useMemo(() => resources.create<Member>('projects/{project}/members', {project}), [])
    const dataSource = useMemo(() => membersApi.createDataSource({paginator: false}), [])

    useEffect(() => {
        dataSource.fetchInit()
    }, [])

    const columns: ProColumnType<Member>[] = [
        {
            title: '真实姓名',
            dataIndex: 'real_name',
            width: 120,
            render: (_, row) => <UserAvatar user={row.member} showName />
        },
        {
            title: '角色',
            width: 120,
            render: (_, record) => <Tag>{record.role.name}</Tag>,
        },
        {
            title: '邮箱',
            dataIndex:"email",
        },
        {
            title: "过期",
            width: 200,
            dataIndex: 'expired',
            valueType: 'dateTime',
        },
        {
            title: '操作',
            width: 200,
            render: (_, row) => (
                <Space>
                    <DeleteButton size={"small"} dataSource={dataSource} item={row} />
                </Space>
            )
        }
    ];

    return (
        <>
            <InviteForm
                open={visible}
                onClose={() => setVisible(false)}
                onSubmit={async (value) => {

                    for (let memberId of value.members) {
                        for (let roleId of value.roles) {
                            if (! dataSource.data.find((item) => item.member.id === memberId && item.role.id === roleId)) {
                                await membersApi.create({member: memberId, role: roleId, expired: value.expired} as any)
                            }
                        }
                    }

                    await dataSource.sync()
                    await dataSource.fetch()

                    setVisible(false)
                }} />
            <Observer>{() => (
                <ProTable dataSource={dataSource}
                    size={"small"}
                    columns={columns}
                    toolBarRender={() => [
                        <Button key={'invite-form'} onClick={() => setVisible(true)} type="primary">邀请成员</Button>
                    ]}
                />
            )}</Observer>
        </>
    )
}

export default Members;

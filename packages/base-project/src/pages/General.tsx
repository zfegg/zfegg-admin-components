import {FC, ReactNode, useMemo, useState} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {useService} from "@moln/react-ioc";
import {Resources} from "@moln/data-source";
import ProCard from "@ant-design/pro-card";
import {Button, Col, Form, Input, notification, Popconfirm, Row} from "antd";
import {Project} from "../interfaces";
import {useRequest} from "ahooks";
import {AxiosInstance} from "axios";
import {useOutletContext} from "react-router";
import {AvatarUpload} from "@zfegg/admin-application";

const SettingSecret: FC<{project: Project, onFinish: () => Promise<void>}> = ({project, onFinish}) => {

    const http = useService<AxiosInstance>('request')
    const {loading, run} = useRequest(async () => {
        await http.get(`projects/${project.id}/generate-secret`)
        await onFinish()
    }, {manual: true})

    return (
        <ProCard title={'服务器密钥(Secret)'}>
            <Form>
                <Input.Group compact>
                    <Input readOnly value={project.secret} style={{maxWidth: 300}} />
                    <Popconfirm title={'确认重置'} onConfirm={run}>
                        <Button loading={loading}>重置</Button>
                    </Popconfirm>
                </Input.Group>
            </Form>
        </ProCard>
    )
}

const General: FC<{children?: (project: Project) => ReactNode}> = ({children}) => {
    const {project: {id: projectId}} = useOutletContext<{project: Project}>();
    const [form] = Form.useForm()
    const resources = useService(Resources)
    const projects = useMemo(() => resources.create<Project>('projects'), [])
    const [project, setProject] = useState<Project>()
    const {loading: submitting, run: onFinish} = useRequest(async (values: Record<string, any>) => {
        console.log(values);
        const rs = await projects.update(projectId, values)
        setProject(rs)
        notification.success({message: '操作成功'})
    }, {manual: true})
    const loadProject = async () => {
        setProject((await projects.get(projectId))!);
    }
    const {loading} = useRequest(loadProject)

    return (
        <PageContainer
            loading={loading}
        >
            {project && (
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <SettingSecret project={project!} onFinish={() => loadProject()} />
                    </Col>
                    <Col span={24}>
                        <ProCard title={"基础设置"}>
                            <Form
                                layout={"vertical"}
                                wrapperCol={{span: 12}}
                                initialValues={project!}
                                form={form}
                                onFinish={onFinish}
                            >
                                <Form.Item name={"id"} label={"ID"}>
                                    <Input disabled/>
                                </Form.Item>
                                <Form.Item name={"code"} label={"编号"} rules={[{required: true}]}>
                                    <Input disabled/>
                                </Form.Item>
                                <Form.Item name={"name"} label={"名称"} rules={[{required: true}]}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item name={"description"} label={"描述"}>
                                    <Input.TextArea />
                                </Form.Item>
                                <Form.Item name={"avatar"} label={"头像"}>
                                    <AvatarUpload/>
                                </Form.Item>
                                {children && children(project)}
                                <Form.Item>
                                    <Button type="primary" htmlType={"submit"} loading={submitting}>
                                        保存
                                    </Button>
                                </Form.Item>
                            </Form>
                        </ProCard>
                    </Col>
                </Row>
            )}
        </PageContainer>
    )
}

export default General
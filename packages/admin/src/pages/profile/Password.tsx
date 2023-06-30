import React, {FC, useState} from "react";
import {Alert, Button, Form, Input, notification} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {ProCard} from "@ant-design/pro-card";
import {useService} from "@moln/react-ioc";
import ProfileService from "../../services/ProfileService";

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
    style: {
        maxWidth: 600,
    },
};

const Password: FC = () => {
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState()
    const profileService = useService(ProfileService)
    const onFinish = async (values: Record<string, string>) => {
        setLoading(true)
        try {
            await profileService.changePassword(values)
            notification.success({
                message: "修改成功"
            })
        } catch (e: any) {
            console.log(e);
            setErrorMessage(e.response?.data?.message)
        } finally {
            setLoading(false)
        }
    };
    return (
        <PageContainer>
            <ProCard>
                <Form {...layout} name="account-password" onFinish={onFinish}>
                    {errorMessage && (
                        <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                            <Alert type={"error"} showIcon message={errorMessage} />
                        </Form.Item>
                    )}
                    <Form.Item
                        name={'old_password'}
                        label="当前密码"
                        rules={[{required: true}]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name={'password'}
                        label="新密码"
                        rules={[{required: true}]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name={'confirm_password'}
                        label="确认新密码"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {required: true},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    console.log(getFieldValue('password'), value);
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject('输入的密码不匹配!');
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                        <Button loading={loading} type="primary" htmlType="submit">
                            保存
                        </Button>
                    </Form.Item>
                </Form>
            </ProCard>
        </PageContainer>
    );
};

export default Password
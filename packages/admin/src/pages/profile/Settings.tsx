import React, {useEffect, useState} from 'react';
import {Alert, App, Button, Card, Form, Input} from 'antd';
import {PageContainer} from '@ant-design/pro-layout';
import {UserProfile} from "../../interfaces";
import {useService} from "@moln/react-ioc";
import ProfileService from "../../services/ProfileService";
import AvatarUpload from "../../components/AvatarUpload";


const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
    style: {
        maxWidth: 600,
    },
};


function Settings() {

    const {notification} = App.useApp()
    const [loading, setLoading] = useState(false)
    const profileService = useService(ProfileService)
    const [user, setUser] = useState<UserProfile>();
    const onFinish = async (values: Record<string, string>) => {
        console.log(values);
        setLoading(true)
        try {
            const user = await profileService.update(values)
            setUser(user)
            notification.success({
                message: "修改成功"
            })
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        (async () => {
            setUser(await profileService.fetchUserProfile());
        })();
    }, []);

    return (
        <PageContainer loading={!user}>
            <Card>
                <Alert message="部分基础信息限制管理员才能修改" type="warning" showIcon />
                <br />
                {user && (
                    <Form
                        {...layout}
                        initialValues={user}
                        name="nest-messages"
                        onFinish={onFinish}
                    >
                        <Form.Item name={'avatar'} label="头像">
                            <AvatarUpload />
                        </Form.Item>
                        <Form.Item name={'real_name'} label="姓名">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name={'email'} label="Email" rules={[{type: 'email'}]}>
                            <Input disabled />
                        </Form.Item>
                        <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                            <Button loading={loading} type="primary" htmlType="submit">
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Card>
        </PageContainer>
    );
}

export default Settings;

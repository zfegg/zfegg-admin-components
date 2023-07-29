import {LockTwoTone, LoginOutlined, UserOutlined,} from '@ant-design/icons';
import {Alert, Button, Form, Input} from 'antd';
import React, {FC, ReactNode, useEffect, useState} from 'react';
import styles from './login.module.less';
import {useService} from "@moln/react-ioc";
import {useLocation, useNavigate} from "react-router";
import Authentication from "../services/Authentication";

interface LoginFormProps {
    onSubmit: (values: Record<string, string>) => Promise<void>
}

const LoginMessage: FC<{content: string;}> = ({content}) => (
    <Form.Item>
        <Alert
            message={content}
            type="error"
            showIcon
        />
    </Form.Item>
);

export const LoginForm: FC<LoginFormProps> = ({onSubmit}) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [errorMsg, setErrorMsg] = useState<string>();
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (data: {email: string, password: string}) => {
        const query = new URLSearchParams(location.search);
        try {
            setLoading(true)
            await onSubmit(data)
            navigate(query.get('redirect') || '/')
        } catch (e: any) {
            const msg = e.response?.data?.message || `系统错误!!`;
            setErrorMsg(`错误(${e.response?.status || '0'}): ${msg}`);
        } finally {
            setLoading(false)
        }
    };
    const size = 'large'
    return (
        <div className={styles.main}>
            <Form onFinish={handleSubmit}>
                {errorMsg && <LoginMessage content={errorMsg} />}
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: "请输入邮箱!",
                        },
                        {type: "email", message: "请输入邮箱格式!",},
                    ]}
                >
                    <Input
                        type={"email"}
                        size={size}
                        prefix={<UserOutlined className={styles.prefixIcon} />}
                        placeholder={"请输入邮箱"}
                        allowClear
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "请输入密码!",
                        },
                    ]}
                >
                    <Input.Password
                        size={size}
                        prefix={<LockTwoTone className={styles.prefixIcon} />}
                        placeholder={"请输入密码"}
                        allowClear
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        loading={loading}
                        type={"primary"}
                        htmlType={"submit"}
                        block
                        size={size}
                        icon={<LoginOutlined />}
                    >登录</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export const useClearClientState = (title: string) => {

    const auth = useService(Authentication)

    useEffect(() => {
        document.title = `登录 - ${title}`
        if (auth.user) {
            (async () => {
                await auth.destroy()
                window.location.reload() // Clear client state
            })()
        } else if (auth.user === null) {
            window.location.reload()
        }
    }, [])
}

export interface LoginProps {
    onSubmit?: LoginFormProps['onSubmit']
    title?: string
    desc?: ReactNode
}
const Login: FC<LoginProps> = (
    {
        onSubmit = () => Promise.resolve(),
        title = "管理后台",
        desc
    }
) => {

    useClearClientState(title)

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.top}>
                    <div className={styles.header}>
                        <div className={styles.logo} />
                        <span className={styles.title}>{title}</span>
                    </div>
                    <div className={styles.desc}>{desc}</div>
                </div>
                <LoginForm onSubmit={onSubmit} />
            </div>
        </div>
    );
};

export default Login;

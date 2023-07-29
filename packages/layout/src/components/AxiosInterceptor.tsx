import React, {FC, useEffect} from "react";
import {CONFIG_KEY} from "../constants";
import {gotoLogin} from "../utils";
import {App} from "antd";
import {useService} from "@moln/react-ioc";
import {AxiosInstance} from "axios";
import {Router} from "@remix-run/router";

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

const AxiosInterceptor: FC = () => {
    const http = useService<AxiosInstance>('request')
    const router = useService<Router>('router')
    const redirectLogin = useService<Record<any, any>>('config')[CONFIG_KEY].redirectLogin || gotoLogin;
    const {notification, modal: {error}} = App.useApp()

    useEffect(() => {
        http.interceptors.response.use(
            (response) => response,
            (e) => {
                const {response, config} = e;

                switch (response?.status) {
                case 401:
                    const url = response.data?.login_url;

                    error({
                        title: '认证无效!',
                        content: <div>你的当前页面认证失效{url ? ', 点击确认跳转登录页面' : ''}!</div>,
                        onOk() {
                            redirectLogin(router);
                        },
                    });
                    break;
                case 422:
                    const errors = response.data?.validation_messages as Record<string, Record<string, string>>;

                    error({
                        title: '参数验证错误!',
                        content: Object.entries(errors).map(([str, msgs]) => (
                            <div key={str}>
                                {str}:{' '}
                                {Object.entries(msgs).map(([key, msg]) => (
                                    <div key={key}>
                                            ({key}) {msg}
                                    </div>
                                ))}
                            </div>
                        )),
                    });
                    break;
                case null:
                case undefined:
                    notification.error({
                        description: '您的网络发生异常，无法连接服务器',
                        message: '网络异常',
                    });
                    break;
                default:
                    const errorText =
                            response.data?.message ||
                            response.data?.detail ||
                            codeMessage[response.status as keyof typeof codeMessage] ||
                            response.statusText;
                    const {status} = response;

                    notification.error({
                        message: `请求错误 ${status}: ${config.baseURL}${config.url}`,
                        description: errorText,
                    });
                    break;
                }

                return Promise.reject(e);
            }
        );
    }, [http])

    return null;
}

export default AxiosInterceptor
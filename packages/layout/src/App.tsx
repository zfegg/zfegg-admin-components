import React, {FC, Suspense} from "react";
import {useService} from "@moln/react-ioc";
import {RouterProvider,} from "react-router";
import {Router} from '@remix-run/router';
import {App as AntdApp} from 'antd';
import "./App.css";
import {PageLoading} from "@ant-design/pro-layout";

type Props = {};

const App: FC<Props> = () => {
    const router = useService<Router>('router')
    const loading = <PageLoading />

    return (
        <AntdApp>
            <Suspense fallback={loading}>
                <RouterProvider router={router} fallbackElement={loading}/>
            </Suspense>
        </AntdApp>
    );
}

export default App

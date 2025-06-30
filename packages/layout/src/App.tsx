import React, {FC, Suspense} from "react";
import {useService} from "@moln/react-ioc";
import {RouterProvider} from "react-router";
import type {DataRouter} from "react-router";
// import {Router} from 'react-router-dom';
import {App as AntdApp} from 'antd';
import "./App.css";
import {PageLoading} from "@ant-design/pro-layout";
import AxiosInterceptor from "./components/AxiosInterceptor";


const App: FC = () => {
    const router = useService<DataRouter>('router')

    return (
        <AntdApp>
            <AxiosInterceptor />
            <Suspense fallback={<PageLoading />}>
                <RouterProvider router={router} />
            </Suspense>
        </AntdApp>
    );
}

export default App

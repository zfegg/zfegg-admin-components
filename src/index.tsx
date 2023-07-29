import container from './container';
import {App} from '@zfegg/admin-layout';
import React from "react";
import ReactDOM from "react-dom";
import {ConfigProvider} from "antd";
import {DependencyContainerProvider} from "@moln/react-ioc";

ReactDOM.render(
    <React.StrictMode>
        <DependencyContainerProvider container={container}>
            <ConfigProvider
                theme={{
                    token: {
                        borderRadius: 4,
                        // borderRadiusSM: 6,
                        // borderRadiusXS: 6,
                        // borderRadiusLG: 6,
                    },
                }}
            >
                <App />
            </ConfigProvider>
        </DependencyContainerProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
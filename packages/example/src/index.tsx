import container from './container';
import {App} from '@zfegg/admin-layout';
import React from "react";
import { createRoot } from 'react-dom/client';
import {ConfigProvider} from "antd";
import {DependencyContainerProvider} from "@moln/react-ioc";

const root = createRoot(document.getElementById("root")!); // createRoot(container!) if you use TypeScript
root.render(
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
    </React.StrictMode>
);

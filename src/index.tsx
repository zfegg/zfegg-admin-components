import 'reflect-metadata';
import container from './container';
import {App} from '@zfegg/admin-application';
import React from "react";
import ReactDOM from "react-dom";
import type {History} from "history";
import {ConfigProvider} from "antd";

const history = container.get<History>("history")

ReactDOM.render(
    <React.StrictMode>
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
            <App container={container} history={history} />
        </ConfigProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
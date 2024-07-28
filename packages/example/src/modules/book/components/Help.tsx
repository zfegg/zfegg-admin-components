import {Tooltip} from "antd";
import React from "react";
import {QuestionCircleOutlined} from "@ant-design/icons";
export default (() => (
    <Tooltip title="Help">
        <div className={"yca-layout-header-action"}>
            <QuestionCircleOutlined />
        </div>
    </Tooltip>
))

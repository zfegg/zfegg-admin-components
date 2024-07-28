import {Badge, Tooltip} from "antd";
import React from "react";
import {BellOutlined} from "@ant-design/icons";

export default (() => (
    <Tooltip title="Help">
        <div className={"yca-layout-header-action"}>
            <Badge dot>
                <BellOutlined  />
            </Badge>
        </div>
    </Tooltip>
))

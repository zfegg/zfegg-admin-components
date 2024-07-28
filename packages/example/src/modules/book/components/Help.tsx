import {Tooltip} from "antd";
import React from "react";
import {QuestionCircleOutlined} from "@ant-design/icons";

import { Link } from "react-router-dom";
export default (() => (
    <Tooltip title="Help">
        <div className={"yca-layout-header-action"}>
            <Link to={"/"}><QuestionCircleOutlined /></Link>
        </div>
    </Tooltip>
))

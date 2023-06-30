import {Link} from "react-router-dom";
import Icon from "@ant-design/icons";
import {Tooltip} from "antd";
import React, {FC} from "react";
import {ReactComponent as IconAdmin} from '../assets/icon-admin.svg';
import {useService} from "@moln/react-ioc";
import {Authentication, useMatchedRoute} from "@zfegg/admin-application";

const HeadRightAdmin: FC & {index?: number} = () => {

    const route = useMatchedRoute()!;
    const user = useService(Authentication).user!

    if (! user.admin) {
        return null
    }

    const classes = ['yca-layout-header-action'];
    if (route.key?.toString().indexOf('admin') === 0) {
        classes.push('focus')
    }
    return (
        <Tooltip title="管理员设置">
            <Link to={"/admin/home"} className={classes.join(' ')}>
                <Icon component={IconAdmin}  />
            </Link>
        </Tooltip>
    )
}

HeadRightAdmin.index = -1000

export default HeadRightAdmin;

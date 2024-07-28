import {Link, useMatches} from "react-router-dom";
import Icon from "@ant-design/icons";
import {Tooltip} from "antd";
import {FC} from "react";
import IconAdmin from '../assets/icon-admin.svg';
import {useService} from "@moln/react-ioc";
import {Authentication} from "@zfegg/admin-layout";

const HeadRightAdmin: FC & {index?: number} = () => {

    const route = useMatches()[0] as any;
    const user = useService(Authentication).user!

    if (! user.admin) {
        return null
    }

    const classes = ['zfe-layout-header-action'];
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

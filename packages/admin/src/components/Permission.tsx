import {FC, ReactNode} from "react";
import {AuthUser} from "../interfaces";
import {Authentication} from "@zfegg/admin-application";
import {useService} from "@moln/react-ioc";

const Permission: FC<{ name: string, children: ReactNode}> = ({name, children}) => {
    const user = useService<Authentication<AuthUser>>(Authentication).user!

    if (! user.admin && user.menus.indexOf(name) === -1) {
        return null;
    }

    return children as any
}

export default Permission

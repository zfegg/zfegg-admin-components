import {FC, ReactNode} from "react";
import {useService} from "@moln/react-ioc";
import Authentication from "../services/Authentication";

const Permission: FC<{ name: string, children: ReactNode}> = ({name, children}) => {
    const user = useService(Authentication)

    if (user.hasPermission(name)) {
        return null;
    }

    return children as any
}

export default Permission

import React, {ComponentProps, FC} from "react";
import {useService} from "@moln/react-ioc";
import {Authentication, UserAvatar as DefaultUserAvatar} from "@zfegg/admin-layout";

const UserAvatar: FC<Omit<ComponentProps<typeof DefaultUserAvatar>, 'user'>> = (props) => {
    const user = useService(Authentication).user!
    return (
        <DefaultUserAvatar user={user} showName {...props} />
    )
}

export default UserAvatar
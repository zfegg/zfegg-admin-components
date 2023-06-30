import React, {ComponentProps, FC} from "react";
import {useService} from "@moln/react-ioc";
import {Authentication, UserAvatar as DefaultUserAvatar} from "@zfegg/admin-application";
import {observer} from "mobx-react";

const UserAvatar: FC<Omit<ComponentProps<typeof DefaultUserAvatar>, 'user'>> = observer(({showName = true, ...props}) => {
    const user = useService(Authentication).user!
    return (
        <DefaultUserAvatar user={user} showName {...props} />
    )
})

export default UserAvatar
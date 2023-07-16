import {Avatar, Space} from 'antd';
import {User} from '../interfaces';
import React, {ComponentProps, FC} from 'react';

const UserAvatar: FC<{ user: User; showName?: boolean } & ComponentProps<typeof Avatar>> = ({
    user: {avatar, real_name},
    showName = false,
    children,
    ...props
}) => {
    const component = (
        <Avatar size={'small'} src={avatar} {...props}>
            {children || real_name[0]}
        </Avatar>
    );

    if (showName) {
        return (
            <Space>
                {component}
                <span>{real_name}</span>
            </Space>
        );
    } else {
        return component;
    }
};

export default UserAvatar;

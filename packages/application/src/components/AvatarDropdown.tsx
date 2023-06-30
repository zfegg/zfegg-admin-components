import {LogoutOutlined} from '@ant-design/icons';
import {Avatar, Dropdown, Menu} from 'antd';
import React, {FC, useMemo} from 'react';
import {useService} from '@moln/react-ioc';
import {Authentication} from '../authentication';
import type {History} from 'history';
import styles from './AvatarDropdown.module.less';
import {gotoLogin} from '../utils';
import {CONFIG_KEY} from '../constants';
import {AvatarDropdownProps, IConfigProvider} from "../interfaces";


const AvatarDropdown: FC<AvatarDropdownProps> & { index?: number } = ({menuItems, git}) => {
    const auth = useService(Authentication);
    const user = auth.user!;
    const destroy = auth.destroy;
    const history = useService<History>('history');
    const config = useService<Record<string, any>>('config')[CONFIG_KEY] as IConfigProvider
    const redirectLogin = config.redirectLogin || gotoLogin;

    menuItems = useMemo(() => {
        const items = [
            ...(menuItems || []),
            ...(config.avatarDropdownProps?.menuItems || []),
        ]
        if (items.length) {
            items.push({key: 'divider-profile', type: "divider"})
        }

        git = git || config.avatarDropdownProps?.git
        if (git) {
            const {tag, hash} = git
            items.push({
                key: "version",
                label: `版本：${tag} ${hash}`,
            })
            items.push({key: 'divider-git', type: "divider"})
        }

        return [
            ...items,
            {
                key: "logout",
                onClick: async () => {
                    await destroy();
                    (redirectLogin || gotoLogin)(history);
                },
                icon: <LogoutOutlined />,
                label: '退出登录',
            }
        ];
    }, [config.avatarDropdownProps, menuItems, git])

    return (
        <Dropdown menu={{items: menuItems}} arrow>
            <div className={styles.avatar}>
                <Avatar size={28} src={user?.avatar}>
                    {user.real_name[0]}
                </Avatar>
                {user.real_name}
            </div>
        </Dropdown>
    );
};

AvatarDropdown.index = 1000;

export default AvatarDropdown;

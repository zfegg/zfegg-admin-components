import React, {ComponentProps, FC, useEffect, useMemo} from "react";
import {Space, Tag} from "antd";
import {useService} from "@moln/react-ioc";
import {Resources} from "@moln/data-source";
import {IRole} from "../interfaces";
import {observer} from "mobx-react";

export const RoleTag2: FC<{roles: number[]}> = observer(({roles}) => {
    const resources = useService(Resources);
    const roleDS = useMemo(() => resources.create<IRole>('admin/roles').createDataSource(), [])

    useEffect(() => {
        roleDS.fetchInit();
    }, [])

    const kv: Record<any, any> = {};
    roleDS.data.forEach((item) => {
        kv[item.id] = item.name
    })

    return (
        <RoleTag roles={roleDS.data.filter(item => roles.indexOf(item.id) > -1)} />
    )
})

type Props = ComponentProps<typeof Tag> & {roles: IRole[]}
const RoleTag: FC<Props> = ({roles, ...props}) => {
    return (
        <Space>
            {roles.map(({id, name}) => <Tag key={id} {...props}>{name}</Tag>)}
        </Space>
    )
}

export default RoleTag

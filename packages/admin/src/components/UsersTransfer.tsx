import React, {FC, useEffect, useMemo} from "react";
import {IUser} from "../interfaces";
import {observer} from "mobx-react";
import {useService} from "@moln/react-ioc";
import {Resources} from "@moln/data-source";
import {Transfer, TransferProps} from "antd";
import {UserAvatar} from "@zfegg/admin-layout";

type ValueType = (number | IUser)[];
type Props = Partial<Omit<TransferProps<IUser>, 'dataSource'>> & {
    value?: ValueType,
    valueObj?: boolean,
    onChange?: (value: ValueType) => void
};

const UsersTransfer: FC<Props> = observer((
    {
        value,
        valueObj = false,
        onChange,
        ...props
    }
) => {
    const resources = useService(Resources);
    const users = useMemo(() => resources.create<IUser>('admin/users').createDataSource(), [])

    useEffect(() => {
        users.fetchInit()
    }, [])

    const dataSource = users.data.map(item => ({
        key: item.id.toString(),
        title: item.real_name,
        description: item.email,
        disabled: item.status === 0,
        ...item,
    }))

    const targetKeys = value?.map(row => (typeof row === 'object' ? row.id : row).toString()) || []

    return (
        <Transfer showSearch
            pagination
            oneWay
            dataSource={dataSource as any}
            targetKeys={targetKeys}
            render={u => <UserAvatar user={u} showName={true} />}
            filterOption={(inputValue, item) => {
                return item.real_name.indexOf(inputValue) !== 0 ||
                          (item.email && item.email.indexOf(inputValue) >= 0) as boolean
            }}
            onChange={(selectedKeys) => {
                const value = selectedKeys.map((id) => valueObj ? users.get(Number(id))! : Number(id));
                onChange && onChange(value)
            }}
            {...props}
        />
    )
});

export default UsersTransfer;
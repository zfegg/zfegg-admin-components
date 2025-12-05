import React, {ComponentProps, FC, useEffect, useMemo} from "react";
import {Avatar, Select, Space, Spin} from "antd";
import {Resources} from "@moln/data-source";
import {UserOutlined} from "@ant-design/icons";
import {useService} from "@moln/react-ioc";
import {Observer} from "mobx-react-lite";
import debounce from "lodash/debounce";
import {IUser} from "../interfaces";


const UserSelect: FC<ComponentProps<typeof Select> & {dataFilter?: (data: IUser) => boolean}> = ({dataFilter, ...props}) => {

    const resources = useService(Resources);
    const users = useMemo(() => resources.createDataSource<IUser>('admin/users'), [])

    useEffect(() => {
        users.fetchInit()
    }, [])

    const debounceFetcher = React.useMemo(() => debounce((value: string) => {
        if (value) {
            users.setFilters({
                filters: [
                    {field: 'real_name', operator: 'contains', value},
                    {field: 'email', operator: 'contains', value},
                ],
                logic: 'or'
            })
        } else {
            users.setFilters(null);
        }
        users.fetch()
    }, 800), []);

    return (
        <Observer>{() => {
            const options = (dataFilter ? users.data.filter(dataFilter) : users.data).map((item) => ({
                value: item.id,
                key: item.id,
                label: (
                    <Space>
                        <Avatar size={'small'} icon={item.avatar ? null : <UserOutlined />} src={item.avatar} />
                        {item.real_name}
                    </Space>
                )
            }));

            return (
                <Select
                    mode="multiple"
                    allowClear
                    placeholder="选择用户"
                    filterOption={false}
                    onSearch={debounceFetcher}
                    notFoundContent={users.loading ? <Spin size="small" /> : undefined}
                    options={users.loading ? [] : options}
                    {...props}
                >
                </Select>
            )
        }}</Observer>
    )
}

export default UserSelect;

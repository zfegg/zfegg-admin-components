import React, {ComponentProps, FC, useEffect, useMemo} from "react";
import {Avatar, Select, Space, Spin} from "antd";
import {Resources} from "@moln/data-source";
import {UserOutlined} from "@ant-design/icons";
import {useService} from "@moln/react-ioc";
import {Observer} from "mobx-react-lite";
import debounce from "lodash/debounce";
import {IUser} from "@zfegg/admin-admin";
import {useParams} from "react-router";
import {ProjectParam} from "../interfaces";

const {Option} = Select;

const AllUserSelect: FC<ComponentProps<typeof Select> & {dataFilter?: (data: IUser) => boolean}> = ({dataFilter, ...props}) => {

    const {project} = useParams() as ProjectParam
    const resources = useService(Resources);
    const users = useMemo(() => {
        const ds = resources.createDataSource<IUser>('projects/{project}/users', {pathParams: {project}});
        ds.addFilter({field:"status", value: 1})
        return ds;
    }, [])

    useEffect(() => {
        users.fetchInit()
    }, [])

    const debounceFetcher = React.useMemo(() => debounce((value: string) => {
        users.setFilters({
            filters: [
                {field: 'real_name', operator: 'contains', value},
                {field: 'email', operator: 'contains', value},
            ],
            logic: 'or'
        })
        users.fetch()
    }, 800), []);

    return (
        <Observer>{() => {
            const options = (dataFilter ? users.data.filter(dataFilter) : users.data).map((item) => (
                <Option key={item.id} value={item.id}>
                    <Space>
                        <Avatar size={'small'} icon={item.avatar ? null : <UserOutlined />} src={item.avatar} />
                        {item.real_name}
                    </Space>
                </Option>
            ));

            return (
                <Select
                    mode="multiple"
                    allowClear
                    placeholder="选择用户"
                    filterOption={false}
                    onSearch={debounceFetcher}
                    notFoundContent={users.loading ? <Spin size="small" /> : null}
                    {...props}
                >
                    {options}
                </Select>
            )
        }}</Observer>
    )
}

export default AllUserSelect;

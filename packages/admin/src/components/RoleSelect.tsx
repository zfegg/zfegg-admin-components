import {ComponentProps, FC, ReactNode, useEffect, useMemo} from "react";
import {Select, Spin} from "antd";
import {IRole} from "../interfaces";
import {useService} from "@moln/react-ioc";
import {Resources} from "@moln/data-source";
import {Observer} from "mobx-react-lite";
import debounce from "lodash/debounce";
import React from "react";

const {Option} = Select;
const isArray = Array.isArray;

type SelectProps = ComponentProps<typeof Select>;
type ValueType = IRole | string | number;

interface Props extends Omit<SelectProps, 'value'> {
    dataFilter?: (data: IRole) => boolean,
    value?: ValueType | ValueType[],
    valueObj?: boolean,
    renderItem?: (item: IRole) => ReactNode
}


const RoleSelect: FC<Props> = (
    {
        dataFilter,
        valueObj = false,
        value,
        onChange,
        renderItem = (item) => <Option key={item.id} value={item.id}>{item.name}</Option>,
        ...props
    }
) => {

    const resources = useService(Resources);
    const roles = useMemo(() => resources.create<IRole>('admin/roles').createDataSource({paginator: false}), [])
    const scalarValue = value && (
        valueObj
            ? (isArray(value) ? (value as IRole[]).map(val => val.id) : (value as IRole).id)
            : value
    ) as SelectProps['value']

    useEffect(() => {
        roles.fetchInit()
    }, [])

    const debounceFetcher = useMemo(() => debounce((value: string) => {
        roles.setFilters({field: 'name', operator: 'contains', value})
        roles.fetch()
    }, 800), []);

    return (
        <Observer>{() => {
            const options = (dataFilter ? roles.data.filter(dataFilter) : roles.data)
                .map(renderItem);

            return (
                <Select
                    mode="multiple"
                    allowClear
                    placeholder="选择角色"
                    filterOption={false}
                    onSearch={debounceFetcher}
                    notFoundContent={roles.loading ? <Spin size="small" /> : null}
                    value={scalarValue}
                    onChange={(value, option) => {
                        if (valueObj) {
                            if (isArray(value)) {
                                value = value.map(val => roles.get(val as number)) as any[]
                            } else {
                                value = roles.get(value as number) as any
                            }
                        }
                        onChange && onChange(value, option)
                    }}
                    {...props}
                >
                    {options}
                </Select>
            )
        }}</Observer>
    )
}

export default RoleSelect
import React, {ComponentProps, FC} from "react";
import {Checkbox, Space} from "antd";
import {FilterValue} from "./interfaces";

interface Props extends Omit<ComponentProps<typeof Checkbox.Group<any>>, 'value' | 'onChange'> {
    value?: FilterValue,
    onChange?: (value: FilterValue) => void,
}

const CheckboxFilter: FC<Props> = ({options, value, onChange, ...props}) => {
    const operator = 'in';
    value = value || {[operator]: null} as FilterValue

    let [, val] = Object.entries(value)[0]
    val = val && ! Array.isArray(val) ? [val] : val;

    return (
        <Checkbox.Group onChange={(e) => onChange?.({[operator]: e} as FilterValue)}
            value={val as string[]}
            {...props}
        >
            <Space direction="vertical">
                {options?.map(item => typeof item === "object"
                    ? <Checkbox key={item.value.toString()} value={item.value}>{item.label}</Checkbox>
                    : <Checkbox key={item} value={item}>{item}</Checkbox>
                )}
            </Space>
        </Checkbox.Group>
    )
}

export default CheckboxFilter;

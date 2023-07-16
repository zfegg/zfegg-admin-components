import React, {ComponentProps, FC} from "react";
import {Radio, Space} from "antd";
import {FilterValue} from "./interfaces";

interface Props extends Omit<ComponentProps<typeof Radio.Group>, 'value' | 'onChange'> {
    value?: FilterValue<string | number | boolean>,
    onChange?: (value: FilterValue) => void,
}

const RadioFilter: FC<Props> = ({options, value, onChange, ...props}) => {
    const operator = 'eq';
    value = value || {[operator]: null} as FilterValue<string>
    const [, val] = Object.entries(value)[0]

    return (
        <Radio.Group onChange={(e) => onChange?.({[operator]: e.target.value} as FilterValue)}
            value={val}
            {...props}
        >
            <Space direction="vertical">
                {options?.map(item => typeof item === "object"
                    ? <Radio key={item.value.toString()} value={item.value}>{item.label}</Radio>
                    : <Radio key={item} value={item}>{item}</Radio>
                )}
            </Space>
        </Radio.Group>
    )
}

export default RadioFilter;

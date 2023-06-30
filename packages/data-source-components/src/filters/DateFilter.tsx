import React, {ComponentProps, FC} from "react";
import {OperatorKeys} from "@moln/data-source";
import {DatePicker, Input, Select} from "antd";
import {normalizeOperators} from "./utils";
import {FilterValue} from "./interfaces";
import dayjs from "dayjs";

type DatePickerProps = Extract<Partial<ComponentProps<typeof DatePicker>>, {showTime?: any}>
type Props = {
    operators?: OperatorKeys[] | { [key in OperatorKeys]: string },
    value?: FilterValue<string>,
    onChange?: (value: FilterValue) => void,
    valueFormat?: string,
    picker?: string
} & Omit<DatePickerProps, 'value' | 'onChange' | 'picker'>

const DateFilter: FC<Props> = ({operators, value, onChange, valueFormat, ...props}) => {
    const [opKeys, options] = normalizeOperators('text', operators)

    value = value || {[opKeys[0]]: null} as FilterValue<string>

    const [operator, val] = Object.entries(value)[0]

    return (
        <Input.Group compact>
            <Select options={options}
                value={operator}
                onChange={(operator) => onChange?.({[operator]: val} as any)}
            />
            <DatePicker
                value={val ? dayjs(val, valueFormat) : null}
                onChange={(inputValue) => onChange?.({[operator]: inputValue && inputValue.format(valueFormat)} as any)}
                {...props as any[]}
            />
        </Input.Group>
    )
}

export default DateFilter;

import {ComponentProps, FC} from "react";
import {DatePicker as AntdDatePicker, TimePicker as AntdTimePicker} from "antd";
import {DEFAULT_DATETIME_FORMAT, DEFAULT_TIME_FORMAT} from "../constants";
import dayjs from "dayjs";

import {DatePickerProps as AntdDatePickerProps} from "antd/lib/date-picker";


type OmitValueProps<C> = Omit<C, 'value' | 'onChange' | 'picker'>
// type AntdDatePickerProps = ComponentProps<typeof AntdDatePicker>
type DatePickerProps1 = Extract<AntdDatePickerProps, {showTime?: any}>

interface DatePickerProps extends OmitValueProps<DatePickerProps1> {
    value?: string | null
    onChange?: (value: string | null) => void
    valueFormat?: string
    picker?: string
}

interface DatePickerProps extends OmitValueProps<ComponentProps<typeof AntdDatePicker>> {
    value?: string | null
    onChange?: (value: string | null) => void
    valueFormat?: string
    picker?: string
    showTime?: boolean
}

export const DatePicker: FC<DatePickerProps> = (
    {
        value,
        onChange,
        valueFormat = DEFAULT_DATETIME_FORMAT,
        ...props
    }
) => {
    return <AntdDatePicker
        value={value && dayjs(value, valueFormat)}
        onChange={(val) => {
            onChange?.(val && val.format(valueFormat))
        }}
        {...props as any} />
}


const AntdRangePicker = AntdDatePicker.RangePicker
interface RangePickerProps extends OmitValueProps<ComponentProps<typeof AntdRangePicker>> {
    value?: [string, string] | null
    onChange?: (value: [string, string] | null) => void
    valueFormat?: string
    picker?: string
}
export const RangePicker: FC<RangePickerProps> = (
    {
        value,
        onChange,
        valueFormat = DEFAULT_DATETIME_FORMAT,
        ...props
    }
) => {

    return <AntdRangePicker
        value={value && value.map(val => dayjs(val, valueFormat))}
        onChange={(value) => {
            onChange?.(value && value.map(val => val && val.format(valueFormat)) as [string, string])
        }}
        {...props as any} />
}


interface TimePickerProps extends OmitValueProps<ComponentProps<typeof AntdTimePicker>> {
    value?: string | null
    onChange?: (value: string | null) => void
    valueFormat?: string
    picker?: string
}


export const TimePicker: FC<TimePickerProps> = (
    {
        value,
        onChange,
        valueFormat = DEFAULT_TIME_FORMAT,
        ...props
    }
) => {

    return <AntdTimePicker
        value={value && dayjs(value, valueFormat)}
        onChange={(val) => {
            onChange?.(val && val.format(valueFormat))
        }}
        {...props as any} />
}

// export const
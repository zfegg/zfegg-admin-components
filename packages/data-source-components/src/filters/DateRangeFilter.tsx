import React, {ComponentProps, FC} from "react";
import {DatePicker} from "antd";
import {FilterValue} from "./interfaces";
import dayjs, {Dayjs} from "dayjs";
import {DEFAULT_DATETIME_FORMAT} from "../constants";

const {RangePicker} = DatePicker;

type RangePickerProps = Extract<Partial<ComponentProps<typeof DatePicker.RangePicker>>, {showTime?: any}>
type Props = {
    value?: FilterValue<string>,
    onChange?: (value: FilterValue<string>) => void,
    valueFormat?: string,
} & Omit<RangePickerProps, 'value' | 'onChange'>

const DateRangeFilter: FC<Props> = ({value, onChange, valueFormat = DEFAULT_DATETIME_FORMAT, ...props}) => {
    const rangeValue = value && Object.entries(value).map(([operator, value]) => dayjs(value, valueFormat)) as [Dayjs, Dayjs]

    return (
        <RangePicker value={rangeValue}
            onChange={(pickerValue) => onChange?.(pickerValue && {
                gte: pickerValue[0]!.format(valueFormat),
                lte: pickerValue[1]!.format(valueFormat),
            } as any)}
            {...props}
        />
    )
}

export default DateRangeFilter;

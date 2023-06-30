import React from "react";
import {FilterValue} from "./interfaces";
import isArray from "lodash/isArray";
import {Select} from "../select";
import {SelectProps} from "../select/interfaces";

type Props<T extends Record<string, any>> = {
    value?: FilterValue<string | string[] | number | number[]>,
    onChange?: (value: FilterValue<string | string[] | number | number[]>) => void,
} & Omit<SelectProps<T>, 'value' | 'onChange'>

export default function SelectFilter<T extends Record<string, any> = any>({value, onChange, ...props}: Props<T>) {

    value = value || {eq: undefined} as FilterValue<string>
    const [, val] = Object.entries(value)[0]

    return (
        <Select<T> value={val}
            onChange={(selectValue) => onChange?.({[isArray(selectValue) ? 'in' : 'eq']: selectValue} as any)}
            {...props}
        />
    )
}

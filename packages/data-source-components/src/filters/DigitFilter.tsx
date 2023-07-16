import React, {FC} from "react";
import {OperatorKeys} from "@moln/data-source";
import {Input, InputNumber, Select} from "antd";
import {normalizeOperators} from "./utils";
import {FilterValue} from "./interfaces";


interface Props {
    operators?: OperatorKeys[] | { [key in OperatorKeys]: string },
    value?: FilterValue<number>,
    onChange?: (value: FilterValue) => void,
}

const DigitFilter: FC<Props> = ({operators, value, onChange}) => {
    const [opKeys, options] = normalizeOperators('digit', operators)

    value = value || {[opKeys[0]]: null} as FilterValue<number>

    const [operator, val] = Object.entries(value)[0]

    return (
        <Input.Group compact>
            <Select options={options}
                value={operator}
                onChange={(operator) => onChange?.({[operator]: val} as any)}
            />
            <InputNumber
                required
                value={val!}
                onChange={(inputValue) => onChange?.({[operator]: inputValue} as any)}
            />
        </Input.Group>
    )
}

export default DigitFilter;

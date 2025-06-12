import React, {FC} from "react";
import {Flex, Input, Select, Space} from "antd";
import {normalizeOperators} from "./utils";
import {FilterValue, OperatorsAttr} from "./interfaces";

interface Props {
    operators?: OperatorsAttr,
    value?: FilterValue<string>,
    onChange?: (value: FilterValue) => void,
}
const TextFilter: FC<Props> = ({operators, value, onChange}) => {
    const [opKeys, options] = normalizeOperators('text', operators)

    value = value || {[opKeys[0]]: null} as FilterValue<string>
    const [operator, val] = Object.entries(value)[0]

    return (
        <Input
            addonBefore={(
                <Select options={options}
                    value={operator}
                    onChange={(operator) => onChange?.({[operator]: val} as any)}
                />
            )}
            required
            autoFocus
            value={val!}
            onChange={(e) => onChange?.({[operator]: e.target.value} as any)}
        />
    )
}

export default TextFilter;

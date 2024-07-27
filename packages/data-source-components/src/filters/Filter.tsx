import {cloneElement, FC, ReactElement} from "react";
import {OperatorKeys} from "@moln/data-source";
import {normalizeOperators} from "./utils";
import {FilterValue} from "./interfaces";

type Props = {
    operators?: OperatorKeys[] | { [key in OperatorKeys]: string },
    value?: FilterValue<string>,
    onChange?: (value: FilterValue) => void,
    children: ReactElement
}

const Filter: FC<Props> = ({children, value, operators, onChange}) => {
    const [opKeys, options] = normalizeOperators('text', operators)

    value = value || {[opKeys[0]]: null} as FilterValue<string>

    const [operator, val] = Object.entries(value)[0]

    console.log(value)
    return cloneElement(
        children,
        {
            value: val,
            onChange: (val: any) => {
                onChange?.({[operator]: val.target ? val.target.value : val})
            }
        }
    )
}

export default Filter;

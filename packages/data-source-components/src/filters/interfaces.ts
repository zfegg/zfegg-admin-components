import {OperatorKeys} from "@moln/data-source";
import {ReactElement} from "react";

export type FilterValue<T = string | number | boolean | (string | number | boolean)[]> = Partial<Record<OperatorKeys, null | T>>
export type FilterElement = ReactElement<{value: FilterValue, onChange: (value: FilterValue) => void}>
export type OperatorsAttr = OperatorKeys[] | { [key in OperatorKeys]: string }

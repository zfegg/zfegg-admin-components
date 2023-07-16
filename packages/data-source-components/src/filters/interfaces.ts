import {OperatorKeys} from "@moln/data-source";
import {ReactElement} from "react";

type Value = string | number | boolean | (string | number | boolean)[]
export type FilterValues<T = Value> = Record<string, FilterValue<T>>
export type FilterValue<T = Value> = Partial<Record<OperatorKeys, null | T>>
export type FilterElement = ReactElement<{value: FilterValue, onChange: (value: FilterValue) => void}>
export type OperatorsAttr = OperatorKeys[] | { [key in OperatorKeys]: string }

import {ProFieldValueType} from "@ant-design/pro-utils";
import {OperatorKeys} from "@moln/data-source";
import isArray from "lodash/isArray";
import {DefaultOptionType} from "rc-select/lib/Select";
import {OperatorsAttr} from "./interfaces";

export const operatorMessages = {
    text: {
        'eq' : '等于',
        'contains': '模糊匹配',
        'startswith': '开头匹配',
        'endswith': '尾部匹配',
    },
    digit: {
        'eq' : '等于',
        'lte': '小于等于',
        'gte': '大于等于',
    }
} as Record<ProFieldValueType, { [key in OperatorKeys] : string }>;

export const defaultOperators = {
    text: ['eq', 'startswith'],
    digit: ['eq', 'lte', 'gte'],
} as Record<ProFieldValueType, OperatorKeys[]>;


export function normalizeOperators(valueType: ProFieldValueType, operators?: OperatorsAttr): [OperatorKeys[], DefaultOptionType[]] {
    operators = operators || defaultOperators[valueType] || ['eq'];

    let options;
    let opKeys: OperatorKeys[];

    if (isArray(operators)) {
        opKeys = operators;
        options = operators.map(value => ({label: operatorMessages[valueType][value], value}));
    } else {
        opKeys = Object.keys(operators) as OperatorKeys[]
        options = opKeys.map(value => ({label: (operators as any)[value], value}));
    }

    return [opKeys, options];
}

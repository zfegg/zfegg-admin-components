import {ComponentProps, ReactNode} from "react";
import {Form} from "antd";
import {JSONSchema7} from "json-schema";
import {SelectProps} from "rc-select";

export type Rules = Exclude<ComponentProps<typeof Form.Item>['rules'], undefined>;

export type UiProps = {
    children?: UiPropsSets,
    render?: (formItemProps: {name: string[], rules: Rules, label: string}, item: JSONSchema7) => ReactNode,
    placeholder?: string,
    span?: number,
    enumOptions?: SelectProps['options'],
    component?: ReactNode
    props?: Record<string, any>
    [key: string] : any
}

export type UiPropsSets = {
    [key: string] : UiProps
}


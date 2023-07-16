import React, {ReactNode} from "react";
import {JSONSchema7} from "json-schema";
import {CheckCircleOutlined} from "@ant-design/icons";
import isArray from 'lodash/isArray'
import {ProColumnType} from "./interfaces";
import {validType} from "../utils";

interface ColumnType<T> {
    title: string,
    dataIndex: string,
    render?: (_: any, row: T) => ReactNode,
}


export function schemaToColumns<T extends Record<string, any>>(schema: JSONSchema7, names?: string | string[]): ColumnType<T>[] {

    if (names) {
        names = isArray(names) ? names : [names]
    } else {
        names = Object.keys(schema.properties || {});
    }

    return names.filter(name => schema.properties?.[name]).map(name => {
        const property = schema.properties![name] as JSONSchema7;

        const type = validType(property)
        let render: ColumnType<T>['render'];
        if (type === "boolean") {
            render = (_, row) => (row[name] ? <CheckCircleOutlined/> : null);
        }

        return {
            title: property.title || name,
            dataIndex: name,
            render,
        }
    })
}

type Option = {label: ReactNode, value: string | number};

export function valueEnumToOptions(valueEnum: Exclude<ProColumnType['valueEnum'], Function | undefined>): Option[] {
    const options: Option[] = [];
    if (valueEnum instanceof Map) {
        (valueEnum as Map<string, string>).forEach((item, value) => {
            options.push({value, label: (item as any).text || item})
        })
    } else {
        Object.entries(valueEnum).forEach(([value, item]) => {
            options.push({value, label: (item as any).text || item})
        })
    }

    return options;
}

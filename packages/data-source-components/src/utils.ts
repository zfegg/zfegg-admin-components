import {JSONSchema7} from "json-schema";
import isArray from "lodash/isArray";
import {useMemo, useState} from "react";
import {useService} from "@moln/react-ioc";
import {Resources} from "@moln/data-source";

export enum Editor {
    Create,
    Edit,
}

export function filterEditable(schema: JSONSchema7, editor: Editor = Editor.Edit): JSONSchema7 {

    const properties: { [key: string]: JSONSchema7 } = {};

    if (schema.properties) {
        Object.entries(schema.properties! as { [key: string]: JSONSchema7 & {creatable?: boolean} })
            .forEach(([key, item]) => {
                if (editor === Editor.Create) {
                    if (item.creatable !== undefined || ! item.readOnly) {
                        properties[key] = item.properties ? filterEditable(item) : item;
                    }
                } else if (! item.readOnly) {
                    properties[key] = item.properties ? filterEditable(item) : item;
                }
            })
    }

    return {
        ...schema,
        properties
    };
}

type DeepString = (string | [string, DeepString])[]

export function filterSchemaByProperties(schema: JSONSchema7, names: DeepString): JSONSchema7 {

    const properties: { [key: string]: JSONSchema7 } = {};

    names.forEach(name => {
        if (! schema.properties) {
            return ;
        }
        if (isArray(name)) {
            properties[name[0]] = filterSchemaByProperties(schema.properties[name[0]] as JSONSchema7, name[1])
        } else {
            properties[name] = schema.properties[name] as JSONSchema7
        }
    })

    return {
        ...schema,
        properties
    };
}


export function getColumnSchema(schema: JSONSchema7, name: string | string[]): JSONSchema7|undefined {
    if (typeof name === 'string') {
        if (schema.properties?.hasOwnProperty(name)) {
            return schema.properties[name] as JSONSchema7;
        }
    } else if (name.length) {
        let subSchema = schema;
        for (let i = 0; i < name.length; i++){
            const subName = name[i];
            subSchema = getColumnSchema(subSchema, subName) as JSONSchema7
            if (! subSchema) return undefined;
        }

        return subSchema;
    }

    return undefined;
}

export function validType(schema: JSONSchema7): string {
    return (typeof schema.type === 'string' ? [schema.type] : schema.type)!.filter(t => t !== "null")[0] as string
}

type TreeData<T> = {
    [key in number | string]: T;
};

export function toTreeData<
    T extends Record<any, any> = Record<any, any>,
    T2 extends Record<any, any> = Record<any, any>
    >(
    rows: T[],
    parentKey: keyof T = 'parent_id',
    key: keyof T = 'id',
    childKey: string = 'children',
    mergeItem: (row: T, item: T2) => T2 = (row, item) => Object.assign(item, {...row})
) {
    const data: TreeData<T2> = {0: {[childKey]: []} as T2};

    rows.forEach(function (row) {
        if (!data[row[key]]) {
            data[row[key]] = {[childKey]: []} as T2;
        }
        if (!data[row[parentKey]]) {
            data[row[parentKey]] = {[childKey]: []} as T2;
        }
        data[row[key]] = mergeItem(row, data[row[key]]);

        data[row[parentKey]][childKey].push(data[row[key]]);
    });

    return data;
}

export const useDataSource: Resources['createDataSource'] = (path, options = {}) => {
    const resources = useService(Resources)
    const {pathParams} = options as any
    return useMemo(() => resources.createDataSource(path as any, options), [path, JSON.stringify(pathParams)])
}

export function useDrawerState<T = number | string>() {
    const [visible, setVisible] = useState(false)
    const [itemId, setItemId] = useState<T>()

    return {
        drawerProps:  {
            visible,
            itemId,
            onClose: () => {
                setVisible(false)
            }
        },
        setItemId: (value: T | undefined) => {
            setVisible(true)
            setItemId(value)
        },
    }
}

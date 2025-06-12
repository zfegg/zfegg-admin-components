import {BaseRootSchema} from "@moln/data-source";

export interface User {
    id: number
    name: string
    age: number
    score: number
}

export interface Role {
    id: number
    name: string
    parent: number
}

export const roles = [
    {id: 1, name: 'admin', parent: 0},
    {id: 2, name: 'developer', parent: 1},
    {id: 3, name: 'editor', parent: 1},
    {id: 4, name: 'viewer', parent: 0},
];

export const roleSchema: BaseRootSchema = {
    "type": "object",
    "primaryKey": "id",
    "properties": {
        "id": {
            "title": "ID",
            "type": "number",
            "readOnly": true,
        },
        "name": {
            "title": "名称",
            "type": "string",
            "readOnly": true,
        },
        "code": {
            "title": "卡代码",
            "type": "string",
            "pattern": "^[A-Z]{4}$",
            "readOnly": true,
        },
    }
}

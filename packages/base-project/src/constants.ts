import {BaseRootSchema} from "@moln/data-source";

export const memberSchema: BaseRootSchema = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            readOnly: true,
        },
        member: {
            type: ["object", "integer"],
        },
        role: {
            type: ["object", "integer"],
        },
        expired: {
            type: ["string", "null"],
            format: 'date-time',
        }
    }
}

export const groupSchema: BaseRootSchema = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            readOnly: true,
        },
        name: {
            title: "名称",
            type: "string",
        },
        members: {
            title: "成员",
            type: "array",
            items: {
                type: "object"
            }
        },
    },
    required: ["name"]
}


export const projectSchema = {
    type: "object",
    properties: {
        "id": {
            type: "string",
            readOnly: true
        },
        "name": {
            title: "项目名称",
            type: "string"
        },
        "code": {
            title: "项目编号",
            type: "string"
        },
        "description": {
            title: "描述",
            type: "string"
        },
        "config": {
            type: ["object", "null"],
            title: "配置",
            properties: {
            }
        },
        'created_at': {
            type: "string",
            title: "创建时间",
            format: 'date-time',
            readOnly: true
        },
        "status": {
            title: "状态",
            type: "integer",
            default: 1
        }
    },
    required: ["name", "code", "status"]

} as BaseRootSchema
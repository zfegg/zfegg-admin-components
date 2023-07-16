import {filterSchemaByProperties} from "@zfegg/admin-data-source-components";
import type {BaseRootSchema} from "@moln/data-source";
import cloneDeep from "lodash/cloneDeep";

export const CONFIG_KEY = '@zfegg/admin-admin';

export enum Status {
    disabled = 0,
    enabled = 1,
    review = 2,
}

export const STATUS_TEXT = new Map<Status, any>([
    [Status.disabled, {text: '禁用', status: 'Error',}],
    [Status.enabled, {text: '启用', status: 'Success',}],
    [Status.review, {text: '审核中', status: 'Default',}],
])



export const userSchema: BaseRootSchema = {
    "type": "object",
    "primaryKey": "id",
    "properties": {
        "id": {
            "type": "integer",
            "readOnly": true
        },
        "email": {
            "type": ["string", "null"],
            "title": "邮箱",
            "format": "email"
        },
        "password": {
            "type": "string",
            "title": "密码"
        },
        "real_name": {
            "type": "string",
            "title": "真实姓名"
        },
        "created_at": {
            "type": "string",
            "title": "创建时间",
            "format": "date-time"
        },
        "updated_at": {
            "type": ["string", "null"],
            "title": "最后更新时间",
            "format": "date-time"
        },
        "status": {
            "type": "integer",
            "title": "状态",
            "default": 1
        },
        "admin": {
            "type": "boolean",
            "title": "管理员",
            "default": false
        },
        "avatar": {
            "type": ["string", "null"],
            "title": "头像"
        },
        "roles": {
            "title": "角色",
            "type":"array",
            "default": [],
            "items": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer"
                    },
                    "name": {
                        "type": "string",
                        "title": "角色名"
                    },
                    "description": {
                        "title": "描述",
                        "type": "string"
                    }
                }
            }
        }
    },
    "required": ["real_name", "status", "admin"]
}

export const addUserSchema = cloneDeep(userSchema)
addUserSchema.required!.push("email", "password")


const simpleUserSchema = filterSchemaByProperties(userSchema as object, ['id', 'real_name', 'email'])
delete simpleUserSchema.required

export const roleSchema = {
    "type": "object",
    "primaryKey": "id",
    "properties": {
        "id": {
            "type": "integer",
            "readOnly": true
        },
        "name": {
            "type": "string",
            "title": "角色名",
        },
        "description": {
            "title": "描述",
            "type": "string"
        },
        "users": {
            "type": "array",
            "title": "用户成员",
            "items": simpleUserSchema
        }
    },
    "required": ["name"]
}
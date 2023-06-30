import {BaseRootSchema} from "@moln/data-source";

export interface Book {
    id: number,
    name: string,
    barcode: string,
    group: Record<any, any>
}


export const book = {
    type: "object",
    "primaryKey": "id",
    "properties": {
        "id": {
            "title": "ID",
            "type": "string",
            "readOnly": true,
        },
        "name": {
            "type": "string",
            "title": "名称",
        },
        "barcode": {
            "type": "integer",
            "title": "条形码",
        },
        "group_id": {
            "type": "integer",
            "title": "组",
        },
        "created_at": {
            "type": ["string"],
            "title": "创建时间",
            // "readOnly": true,
            "format": "date-time"
        },
        "enabled": {
            "type": "boolean",
            "title": "启用",
        },
    },
    required: ["name", "barcode",]
} as BaseRootSchema
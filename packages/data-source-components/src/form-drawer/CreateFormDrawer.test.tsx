import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {ArrayProvider, BaseRootSchema, Resources, Schema} from "@moln/data-source";
import FormDrawer from "./FormDrawer";

import {describe, expect, it} from 'vitest'

export const rule = {
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
            "creatable": true,
        },
        "rule": {
            "title": "卡规则",
            "type": "string",
            "readOnly": true,
            "creatable": true,
        },
        "whichrule": {
            "title": "互斥规则",
            "type": "number",
            "enum": [0, 1, 2],
            "default": 0,
        },
        "state": {
            "title": "卡状态",
            "type": "number",
            "enum": [1, 2],
            "default": 1,
        },
        "common": {
            "title": "通码",
            "type": "boolean",
            "default": false,
        },
        "subject": {
            "title": "邮件标题",
            "type": "string",
        },
        "mail": {
            "title": "邮件内容",
            "type": "string",
        },
        // "created_at": {
        //     "title": "创建时间",
        //     "type": "string",
        //     "format": "date-time",
        //     "readOnly": true,
        // },
        "awards": {
            "type": "object",
            "properties": {
                "awards": {
                    "title": "奖励道具",
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "number"
                            },
                            "num": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "id", "num"
                        ]
                    },
                }
            },
            "required": [
                "awards"
            ]
        }
    },
    "required": [
        "awards",
        "code",
        "mail",
        "name",
        "state",
        "subject",
        "whichrule",
    ]
}

describe("Test CreateFormDrawer", () => {
    it('create form', async () => {
        const data = [{
            "id": 1,
            "type": "TJ",
            "code": "SDFA",
            "name": "2021年1月媒体",
            "rule": "GGTTTTMM#####*****",
            "mutex": "",
            "ptt": 1,
            "ptn": 0,
            "passlen": 0,
            "usepass": 0,
            "limitsec": 0,
            "game_notify": 1,
            "state": 1,
            "modify": "2021-03-09T17:47:04+08:00",
            "whichrule": 0,
            "subject": "至臻礼包2",
            "mail": "打开后获得：800银币、大绷带*5、胜场卡*1、戈弗雷(3天体验)",
            "common": false,
            "awards": {
                "id": 219,
                "name": "至臻礼包2",
                "memo": null,
                "awards": [{"id": "212", "num": "8"}, {"id": "51", "num": "5"}, {"id": "34", "num": "1"}, {
                    "id": "1304",
                    "num": "3"
                }],
                "remark": null,
                "tags": null,
                "status": null,
                "updated_at": null
            },
            "channels": null,
            "allow_zones": null,
            "allow_tags": null
        }];

        const ds = new Resources().createDataSource(data, {schema: new Schema(rule as BaseRootSchema)})
        await ds.fetch()

        render(<FormDrawer dataSource={ds} visible={true} onClose={() => void 0}/>);
        const linkElement = waitFor(() => screen.getByText(/卡规则/i));
        expect(linkElement).toBeInstanceOf(HTMLElement);
    });

})
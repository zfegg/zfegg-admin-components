import {JSONSchema7} from "json-schema";
import React, {ReactNode} from "react";
import {Button, Col, Form, Input, InputNumber, Row, Select as AntdSelect, Switch} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import isArray from "lodash/isArray";
import {Rules, UiProps, UiPropsSets} from "./internal/interfaces";
import {DatePicker, TimePicker} from "./DatePicker";
import {validType} from "../utils";


export function schemaToFormRules(schema: JSONSchema7, required: boolean) {

    const rules: Rules = [];

    let type = validType(schema)

    if (["email", "url"].indexOf(schema.format!) !== -1) {
        type = schema.format as string;
    }

    if (["date-time", "date"].indexOf(schema.format!) !== -1) {
        type = 'string'
    }

    if (schema.enum) {
        type = 'enum'
    }

    rules.push({
        type: type as "string",
        required,
        enum: schema.enum,
        min: schema.minimum,
        max: schema.maximum,
        len: schema.maxLength,
    })

    return rules;
}

export function schemaToFormItem(parentSchema: JSONSchema7, key: string, uiProps: UiProps = {}, parentName: string[] = []): ReactNode {
    const name = parentName.concat([key]);
    const schema = parentSchema.properties?.[key] as JSONSchema7;
    const required = Boolean(parentSchema?.required && parentSchema.required.indexOf(key) > -1);

    if (uiProps.render) {
        return uiProps.render({name, label: schema.title || key, rules: schemaToFormRules(schema, required)}, schema, )
    }

    const type = validType(schema)

    switch (type) {
    case "array":
        return (
            <Form.List
                name={name}
                rules={[]}
            >
                {(fields, {add, remove}, {errors}) => {

                    // const elements = renderObjectItem(schema.items as JSONSchema7, uiProps || {}, name) as RenderItem[];

                    return (
                        <>
                            {/*{fields.map((field, index) => (*/}
                            {/*    <Form.Item*/}
                            {/*        label={index === 0 ? schema.title : name}*/}
                            {/*        required={required}*/}
                            {/*        key={field.key}*/}
                            {/*    >*/}
                            {/*        /!*{renderElements(elements)}*!/*/}
                            {/*        {fields.length > 1*/}
                            {/*            ? <MinusCircleOutlined onClick={() => remove(field.name)} />*/}
                            {/*            : null}*/}
                            {/*    </Form.Item>*/}
                            {/*))}*/}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    style={{width: '60%'}}
                                    icon={<PlusOutlined />}
                                >
                                        添加
                                </Button>
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </>
                    )
                }}
            </Form.List>
        )
    case "object":
        if (! schema.properties) {
            return <></>
        }

        return schemaToFormItems(schema, uiProps.children || {}, name)
    default:
        let component;
        const formItemProps: Record<string, any> = {}

        if (uiProps.component) {
            component = uiProps.component
        } else if (uiProps.enumOptions) {
            if (isArray(uiProps.enumOptions)) {
                component = <AntdSelect options={uiProps.enumOptions} />
            }
        } else if (schema.format === 'date') {
            component = <DatePicker />
        } else if (schema.format === 'date-time') {
            component = <DatePicker showTime />
        } else if (schema.format === 'time') {
            component = <TimePicker />
        }

        if (!component) {
            switch (type) {
            case "number":
            case "integer":
                component = <InputNumber min={schema.minimum} max={schema.maximum} placeholder={uiProps.placeholder} {...uiProps.props} />
                break;
            case "boolean":
                formItemProps['valuePropName'] = 'checked'
                component = <Switch />
                break;
            case "string":
                component = <Input maxLength={schema.maxLength} placeholder={uiProps.placeholder} {...uiProps.props} />
                break;
            }
        }

        return (
            <Form.Item
                name={name}
                label={schema.title || name.join('.')}
                rules={schemaToFormRules(schema, required)}
                {...formItemProps}
            >
                {component}
            </Form.Item>
        )
    }
}

export function schemaToFormItems(schema: JSONSchema7, uiPropsSets: UiPropsSets = {}, names: string[] = []) {
    return (
        <Row gutter={16}>
            {Object.entries((schema.properties || {}) as {[key: string]: JSONSchema7}).map(([key, item]) => {
                const uiProps = uiPropsSets[key] || {};

                const type = validType(item)

                return (
                    <Col span={uiProps.span || (type === 'object' ? 24 : 12)} key={key}>
                        {schemaToFormItem(schema, key, uiProps, names)}
                    </Col>
                )
            })}
        </Row>
    )
}

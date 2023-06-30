import {IDataSource, IModel, schemaDefaultValues} from "@moln/data-source";
import {JSONSchema7} from "json-schema";
import React, {ComponentProps, useEffect, useMemo, useState} from "react";
import {Button, Drawer, Form, Space} from "antd";
import {Editor, filterEditable} from "../utils";
import {Observer} from "mobx-react";
import isEqual from "lodash/isEqual";
import {schemaToFormItems} from "../form";
import {UiPropsSets} from "../form/internal/interfaces";


type BaseDrawerFormProps<T extends Record<any, any> = Record<any, any>> = {
    visible: boolean,
    onClose?: (success?: boolean, row?: IModel<T>) => void,
    dataSource: IDataSource<T>,
    itemId?: string | number,
    schema?: JSONSchema7,
    uiProps?: UiPropsSets,
    drawerProps?: ComponentProps<typeof Drawer>,
    formProps?: ComponentProps<typeof Form>,
    normalize?: (values: T) => any,
    denormalize?: (values: any) => T,
    insertMethod?: "prepend" | "append"
}


export const FormDrawer = <T extends Record<string, any> = Record<string, any>>(
    {
        visible,
        onClose,
        dataSource,
        schema,
        uiProps,
        itemId,
        drawerProps,
        normalize = values => values,
        denormalize = values => values,
        formProps,
        insertMethod = "append"
    }: BaseDrawerFormProps<T>
) => {
    const [form] = Form.useForm();
    const onCloseProp = (success?: boolean, row?: IModel<T>): void => {
        success || dataSource.cancelChanges()
        onClose?.(success, row)
    }
    schema = filterEditable(schema || dataSource.schema.schema, itemId ?  Editor.Edit :  Editor.Create);

    const [submitting, setSubmitting] = useState(false)
    const initialValues = useMemo(() => schemaDefaultValues(schema!) as T, [schema])
    const item = useMemo(() => dataSource.get(itemId!), [schema, itemId, visible]);

    if (itemId && !item) {
        itemId = undefined
    }

    async function handleSubmit(values: any) {
        try {
            values = denormalize(values)
            setSubmitting(true)
            if (! item) {
                const result = await dataSource.dataProvider.create(values);
                if (insertMethod === "append") {
                    dataSource.add(result)
                } else {
                    dataSource.insert(0, result)
                }
            } else {
                const changedFields: Record<string, any> = {}
                Object.entries(values).forEach(([key, val]) => {
                    if (! isEqual(val, item.get(key))) {
                        changedFields[key] = val
                    }
                })
                if (Object.keys(changedFields).length) {
                    const result = await dataSource.dataProvider.update(item[dataSource.primary], changedFields as T)
                    item.set(result)
                }
            }
            dataSource.submit();
            onCloseProp(true, item);
        } catch (e) {
            dataSource.cancelChanges()
            throw e;
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        if (visible) {
            form.resetFields();
            form.setFieldsValue(normalize(item?.toJS() || initialValues));
        }
    }, [itemId, visible])

    return (
        <Drawer
            title={itemId ? "编辑" : '添加'}
            width={720}
            onClose={() => onCloseProp()}
            open={visible}
            bodyStyle={{paddingBottom: 80}}
            footer={
                <Space>
                    <Observer>{() => (
                        <Button loading={submitting} onClick={() => form.submit()} type="primary">
                            确认
                        </Button>
                    )}</Observer>
                    <Button onClick={() => onCloseProp()}>
                        取消
                    </Button>
                </Space>
            }
            {...drawerProps}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={initialValues}
                {...formProps}
            >
                {schemaToFormItems(schema, uiProps)}
            </Form>
        </Drawer>
    )
}

export default FormDrawer;

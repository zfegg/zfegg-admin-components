import {IDataSource, IModel, IModelT, schemaDefaultValues} from "@moln/data-source";
import {JSONSchema7} from "json-schema";
import React, {ComponentProps, PropsWithChildren, useCallback, useEffect, useMemo, useState} from "react";
import {App, Button, Drawer, Form, FormInstance, Space} from "antd";
import {Editor, filterEditable} from "../utils";
import {Observer} from "mobx-react-lite";
import isEqual from "lodash/isEqual";
import {schemaToFormItems} from "../form";
import {UiPropsSets} from "../form/internal/interfaces";


interface BaseDrawerFormProps<T extends Record<any, any> = Record<any, any>> {
    visible: boolean,
    onClose?: (success?: boolean, row?: IModel<T>) => void,
    dataSource: IDataSource<T>,
    itemId?: string | number,
    schema?: JSONSchema7,
    uiProps?: UiPropsSets,
    drawerProps?: ComponentProps<typeof Drawer>,
    formProps?: ComponentProps<typeof Form>,
    successNotification?: false | (() => void)
    form?: FormInstance,
    item?: IModelT<T>,
    normalize?: (values: T) => any,
    denormalize?: (values: any) => T,
    insertMethod?: "prepend" | "append",
}

export function useFormSubmit<T extends Record<string, any>>(
    {
        dataSource,
        item,
        denormalize = values => values,
        insertMethod = "append",
    }: Pick<BaseDrawerFormProps<T>, "dataSource" | "item" | "denormalize" | "insertMethod">
) {

    return useCallback(async (values: any) => {
        values = denormalize(values)
        if (!item) {
            const result = await dataSource.dataProvider.create(values);
            if (insertMethod === "append") {
                dataSource.add(result)
            } else {
                dataSource.insert(0, result)
            }
        } else {
            const changedFields: Record<string, any> = {}
            Object.entries(values).forEach(([key, val]) => {
                if (!isEqual(val, item.get(key))) {
                    changedFields[key] = val
                }
            })
            if (Object.keys(changedFields).length) {
                const result = await dataSource.dataProvider.update(item[dataSource.primary], changedFields as T)
                item.set(result)
            }
        }
        dataSource.submit();
    }, [dataSource, item]);
}

export const FormDrawer = <T extends Record<string, any> = Record<string, any>>(
    {
        visible,
        onClose,
        dataSource,
        schema = dataSource.schema.schema,
        uiProps,
        itemId,
        drawerProps,
        normalize = values => values,
        denormalize = values => values,
        formProps,
        insertMethod = "append",
        children,
        form,
        successNotification,
    }: PropsWithChildren<BaseDrawerFormProps<T>>
) => {
    const {notification} = App.useApp()
    const [wrapForm] = Form.useForm(form);
    const onCloseProp = (success?: boolean, row?: IModel<T>): void => {
        if (success) {
            dataSource.cancelChanges()
        }
        onClose?.(success, row)
    }
    if (successNotification === undefined) {
        successNotification = () => {
            notification.success({message: "操作成功"})
        }
    }

    const [submitting, setSubmitting] = useState(false)

    const {schema2, item, initialValues} = useMemo(() => {
        const schema2 = filterEditable(schema, itemId ? Editor.Edit : Editor.Create);
        const initialValues = formProps?.initialValues || normalize(schemaDefaultValues(schema2) as T)
        return {
            schema2,
            item: dataSource.get(itemId!),
            initialValues,
        }
    }, [itemId, schema]);

    const handleSubmit = useFormSubmit({
        dataSource,
        item,
        denormalize,
        insertMethod,
    })
    const onFinish = async (values: any) => {
        try {
            setSubmitting(true)
            await handleSubmit(values)
            if (successNotification) {
                successNotification()
            }
            onCloseProp(true)
        } catch (e) {
            dataSource.cancelChanges()
            throw e;
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        if (visible) {
            wrapForm.resetFields();
            wrapForm.setFieldsValue(item ? normalize(item.toJS()) : initialValues);
        }
    }, [itemId, visible])

    return (
        <Drawer
            title={itemId ? "编辑" : '添加'}
            width={720}
            onClose={() => onCloseProp()}
            open={visible}
            styles={{body: {paddingBottom: 80}}}
            footer={
                <Space>
                    <Observer>{() => (
                        <Button loading={submitting} onClick={() => wrapForm.submit()} type="primary">
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
                form={wrapForm}
                layout="vertical"
                onFinish={onFinish}
                initialValues={initialValues}
                {...formProps}
            >
                {children || schemaToFormItems(schema2, uiProps)}
            </Form>
        </Drawer>
    )
}

export default FormDrawer;

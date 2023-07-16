import React, {ComponentProps, FC} from "react";
import {Form} from "antd";
import {JSONSchema7} from "json-schema";
import {schemaToFormItems} from "./utils";
import {UiPropsSets} from "./internal/interfaces";

type FormProps = ComponentProps<typeof Form>

type FormEditorProps = {
    name?: string,
    schema: JSONSchema7,
    root?: boolean,
    uiProps?: UiPropsSets,
} & FormProps

const FormEditor: FC<FormEditorProps> = ({schema, uiProps = {}, ...props}: FormEditorProps) => {

    if (schema.type !== "object") {
        throw new Error('Require "object" type at root.')
    }

    return (
        <Form {...props}>
            {schemaToFormItems(schema, uiProps)}
        </Form>
    )
}

export default FormEditor;

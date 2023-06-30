import {ComponentProps} from "react";
import {Select as AntdSelect} from "antd";
import {IDataSource} from "@moln/data-source";

type AntdSelectOption = Exclude<ComponentProps<typeof AntdSelect>['options'], undefined>[0]
export interface SelectProps<T extends Record<string, any>> extends ComponentProps<typeof AntdSelect> {
    dataSource?: IDataSource<T>
    optionsMap?: (item: T) => AntdSelectOption
}

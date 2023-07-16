import {Select as AntdSelect} from "antd";
import {useEffect} from "react";
import {SelectProps} from "./interfaces";
import {observer} from "mobx-react";

function Select<T extends Record<string, any> = Record<any, any>>({dataSource, optionsMap, ...props}: SelectProps<T>) {

    if (!optionsMap) {
        optionsMap = (item: any) => ({value: item.id || item.value, label: item.name || item.title})
    }

    useEffect(() => {
        if (! dataSource) {
            return ;
        }

        dataSource.fetchInit()
    }, [])

    return (
        <AntdSelect loading={dataSource?.loading}
            options={dataSource?.data.map(optionsMap)}
            {...props} />
    )
}

export default observer(Select)

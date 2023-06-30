import React, {ComponentProps, useState} from "react";
import {Button, Popconfirm} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {IDataSource} from "@moln/data-source";

type DeleteButtonProps<T extends Record<string, any>> = {
    title?: string,
    dataSource: IDataSource<T>,

    /**
     * @deprecated 请使用 item 属性替代
     */
    value?: string | number,
    item?: T
    onDeleted?: () => void,
} & Omit<ComponentProps<typeof Button>, 'value'>

function DeleteButton<T extends Record<string, any>>(
    {
        title = "确认删除?",
        value,
        dataSource,
        item,
        onDeleted,
        ...props
    }: DeleteButtonProps<T>
) {
    const [loading, setLoading] = useState(false);
    item = item || dataSource.get(value!)!

    return (
        <Popconfirm
            title={title}
            onConfirm={async () => {
                setLoading(true)
                const primary = item![dataSource.primary]
                try {
                    await dataSource.dataProvider.remove(primary)
                } finally {
                    setLoading(false)
                }
                dataSource.remove(primary)
                dataSource.submit()
                onDeleted?.()
            }}
            disabled={!value}
        >
            <Button icon={<DeleteOutlined/>}
                type={'primary'}
                danger
                disabled={!value}
                loading={loading}
                {...props}
            />
        </Popconfirm>
    )
}

export default DeleteButton
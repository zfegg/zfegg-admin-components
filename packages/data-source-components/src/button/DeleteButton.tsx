import React, {ComponentProps, useState} from "react";
import {Button, Popconfirm} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import type {IDataSource} from "@moln/data-source";

type DeleteButtonProps<T extends Record<string, any>> = {
    title?: string,
    dataSource: IDataSource<T>,
    item: T
    onDeleted?: () => void,
    autoSync?: boolean
} & Omit<ComponentProps<typeof Button>, 'value'>

function DeleteButton<T extends Record<string, any>>(
    {
        title = "确认删除?",
        dataSource,
        item,
        onDeleted,
        autoSync = true,
        ...props
    }: DeleteButtonProps<T>
) {
    const [loading, setLoading] = useState(false);

    return (
        <Popconfirm
            title={title}
            onConfirm={async () => {
                const primary = item[dataSource.primary]
                if (! autoSync) {
                    dataSource.remove(primary)
                    onDeleted?.()
                    return ;
                } else {
                    setLoading(true)
                    try {
                        await dataSource.dataProvider.remove(primary)
                    } finally {
                        setLoading(false)
                    }
                    dataSource.remove(primary)
                    dataSource.submit()
                    onDeleted?.()
                }
            }}
        >
            <Button
                icon={<DeleteOutlined/>}
                type={'primary'}
                danger
                loading={loading}
                {...props}
            />
        </Popconfirm>
    )
}

export default DeleteButton
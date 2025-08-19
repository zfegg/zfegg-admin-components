import {FC, useEffect, useState} from "react";
import {Upload, UploadProps} from "antd";
import {PlusOutlined} from "@ant-design/icons";

let baseAttachmentUrl: string = "";
export function setBaseAttachmentUrl(url: string) {
    baseAttachmentUrl = url
}

export function attachmentUrl(src: string) {
    return /^https?:\/\//.test(src) ? src : (baseAttachmentUrl + src)
}

type FileList = Required<UploadProps>['fileList']

interface Props {
    value?: string[]
    onChange?: (files: string[]) => void
    maxLength?: number
}

const ImageUpload: FC<Props> = (
    {value, onChange, maxLength = 8}
) => {
    // .concat(fileList)
    const [fileList, setFileList] = useState<FileList>([])

    useEffect(() => {
        const files = ((value?.map(url => ({
            name: url.split('/').pop(),
            status: 'done',
            url: attachmentUrl(url),
            uid: url,
        })) || []) as FileList)
        setFileList(files)
    }, [value])

    return (
        <Upload<Record<string, any>>
            action="/api/attachment/images"
            listType="picture-card"
            fileList={fileList}
            onPreview={(f) => {
                console.log(f);
            }}
            onRemove={(...args) => {
                console.log(args)
            }}
            onChange={({file, fileList}) => {
                setFileList(fileList)
                if (file.status === "done" || file.status === "removed") {
                    const files = fileList.map(item => (item.url || item.response?.file?.url))
                    onChange?.(files)
                }
            }}
        >
            {fileList.length >= maxLength ? null :  <PlusOutlined />}
        </Upload>
    )
}

export default ImageUpload

import {FC, useState} from "react";
import {Upload, UploadProps} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {attachmentUrl} from "../../utils";


type FileList = Required<UploadProps>['fileList']

export interface ImageUploadProps extends Omit<UploadProps<Record<string, any>>, 'value' | 'onChange'> {
    value?: string[]
    onChange?: (files: string[]) => void
    maxLength?: number,
}

const ImageUpload: FC<ImageUploadProps> = (
    {value, onChange, action = "/api/attachment/images", maxLength = 8, ...props}
) => {

    const files = ((value?.map(url => ({
        name: url.split('/').pop(),
        status: 'done',
        url: attachmentUrl(url),
        uid: url,
    })) || []) as FileList)
    // .concat(fileList)
    const [fileList, setFileList] = useState<FileList>(files)

    return (
        <Upload<Record<string, any>>
            action={action}
            listType="picture-card"
            fileList={fileList}
            onChange={({file, fileList}) => {
                console.log(file, fileList);
                setFileList(fileList)
                if (file.status === "done") {
                    const files = fileList.map(item => item.url || item.response?.file)
                    onChange?.(files)
                }
            }}
        >
            {fileList.length >= maxLength ? null :  <PlusOutlined />}
        </Upload>
    )
}

export default ImageUpload

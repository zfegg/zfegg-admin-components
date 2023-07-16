import ImageUpload, {ImageUploadProps} from "./ImageUpload";
import {FC} from "react";

interface Props extends Omit<ImageUploadProps, 'value' | 'onChange'> {
    value?: string,
    onChange?: (files: string) => void,
}

const AvatarUpload: FC<Props> = (
    {
        value,
        onChange,
        ...props
    }
) => {
    return (
        <ImageUpload
            value={value ? [value] : undefined}
            onChange={(val) => {
                onChange?.(val[0])
            }}
            maxLength={1}
            {...props}
        />
    )
}

export default AvatarUpload
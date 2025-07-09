import {ImageUpload} from "@zfegg/admin-data-source-components";
import {FC} from "react";
import type {ComponentProps} from "react";

interface Props extends Omit<ComponentProps<typeof ImageUpload>, 'value' | 'onChange'> {
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
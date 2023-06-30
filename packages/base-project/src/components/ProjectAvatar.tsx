import {Avatar, Space} from "antd";
import React, {ComponentProps, FC} from "react";
import {Project} from "../interfaces";

type Props = ComponentProps<typeof Avatar>
const ProjectAvatar: FC<{project: Project, showName?: boolean} & Props> = (
    {
        project,
        showName = false,
        ...props
    }
) => {
    const avatar = <Avatar src={project.avatar} {...props}>{project.name[0]}</Avatar>;
    if (showName) {
        return <Space>{avatar}{project.name}</Space>
    } else {
        return avatar
    }
}

export default ProjectAvatar
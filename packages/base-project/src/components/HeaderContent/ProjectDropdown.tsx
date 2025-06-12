import {useService} from "@moln/react-ioc";
import React, {FC} from "react";
import {Button, Dropdown} from "antd";
import {DownOutlined, ProjectOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {observer} from "mobx-react-lite";
import ProjectAvatar from "../../components/ProjectAvatar";
import ProjectService from "../../services/ProjectService";
import {useRequest} from "ahooks";

const ProjectDropdown: FC = observer(() => {

    const ps = useService(ProjectService);

    const {data: projects} = useRequest(() => {
        return ps.fetchProjects()
    })

    if (!projects?.length) {
        return null;
    }


    return (
        <Dropdown
            menu={{
                items: projects?.map((project) => ({
                    key: project.id,
                    label: (
                        <Link to={`/projects/${project.id}/home`}>
                            <ProjectAvatar size={"small"} project={project} showName/>
                        </Link>
                    )
                }))
            }}
            arrow
        >
            <Button type={'text'}>
                <ProjectOutlined/> 项 目 <DownOutlined/>
            </Button>
        </Dropdown>
    )
})

export default ProjectDropdown

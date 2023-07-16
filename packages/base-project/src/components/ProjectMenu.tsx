import {FC} from "react";
import {Card, Empty, Menu} from "antd";
import {ProjectOutlined} from "@ant-design/icons";
import {useService} from "@moln/react-ioc";
import ProjectAvatar from "../components/ProjectAvatar";
import {observer} from "mobx-react";
import ProjectService from "../services/ProjectService";
import {Link} from "react-router-dom";
import {useRequest} from "ahooks";

const ProjectMenu: FC = observer(() => {
    const ps = useService(ProjectService);
    const {data: projects} = useRequest(() => ps.fetchProjects())


    if (! projects?.length) {
        return (
            <Card size={'small'}>
                <Empty description={"没有任务项目权限"}
                    image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </Card>
        )
    }

    return (
        <Menu theme={"dark"} onClick={() => 0}
            selectedKeys={["project", 'setting:1']}
            mode="horizontal"
            items={[
                {
                    key: 'project',
                    title: '项目',
                    icon: <ProjectOutlined />,
                    // itemIcon: 'project',
                    children: projects.map((project) => ({
                        key: project.id,
                        icon: <ProjectAvatar size={"small"} project={project} />,
                        label:  <Link to={`/projects/${project.id}/home`} ><ProjectAvatar size={"small"} project={project} />{project.name}</Link>
                    }))
                }
            ]}
        />
    )
})

export default ProjectMenu
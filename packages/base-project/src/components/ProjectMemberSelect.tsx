import {Select} from "antd";
import {ComponentProps, FC, useEffect, useMemo} from "react";
import {useService} from "@moln/react-ioc";
import {Resources} from "@moln/data-source";
import {Member, ProjectParam} from "../interfaces";
import {useParams} from "react-router-dom";
import {uniqBy} from "lodash";
import {UserAvatar} from "@zfegg/admin-layout";
import {observer} from "mobx-react-lite";

const { Option } = Select;
type SelectProps = ComponentProps<typeof Select>;

interface Props extends SelectProps {
    project?: number | string
}

const ProjectMemberSelect: FC<Props> = observer(({project, ...props}) => {

    const {project: paramProject} = useParams() as ProjectParam
    const resources = useService(Resources);
    const dataSource = useMemo(() => resources
        .createDataSource<Member>('projects/{project}/members', {pathParams: {project: project || paramProject}, paginator: false}), [])

    useEffect(() => {
        dataSource.fetchInit()
    }, [])

    return (
        <Select
            loading={dataSource.loading}
            placeholder="选择成员"
            {...props}
        >
            {uniqBy(dataSource.data.map(item => item.member), 'id').map((item) => (
                <Option value={item.id} key={item.id}>
                    <UserAvatar user={item} showName />
                </Option>
            ))}
        </Select>
    )
})

export default ProjectMemberSelect
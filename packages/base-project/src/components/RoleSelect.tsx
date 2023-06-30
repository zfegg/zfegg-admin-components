import {ComponentProps, FC, ReactNode, useEffect, useMemo} from "react";
import {useService} from "@moln/react-ioc";
import {IRole} from "@zfegg/admin-admin";
import {Resources} from "@moln/data-source";
import {Select} from "antd";
import {Member} from "../interfaces";
import {observer} from "mobx-react";

const {Option} = Select;
type SelectProps = ComponentProps<typeof Select>;

interface Props extends SelectProps {
    project: number
    renderItem?: (item: IRole) => ReactNode
}

const RoleSelect: FC<Props> = observer((
    {
        project,
        renderItem = (item: IRole) => item.name,
        ...props
    }
) => {

    const resources = useService(Resources);
    const members = useMemo(() => resources.create<Member>('projects/{project}/members', {project}).createDataSource({paginator: false}), [])
    const roles = useMemo(() => {
        const rolesMap: Record<number, IRole> = {};

        members.toJS().forEach((member) => {
            if (! rolesMap[member.role.id]) {
                member.role.users  = []
                rolesMap[member.role.id] = member.role
            }

            rolesMap[member.role.id].users.push(member.member)
        });

        const roles = Object.values(rolesMap)
        roles.sort((a, b) => a.id - b.id)

        return roles
    }, [members.data])

    useEffect(() => {
        members.fetchInit()
    }, [])

    return (
        <Select
            loading={members.loading}
            placeholder="选择角色"
            {...props}
        >
            {roles.map((item) => (
                <Option value={item.id} key={item.id}>
                    {renderItem(item)}
                </Option>
            ))}
        </Select>
    )
})

export default RoleSelect
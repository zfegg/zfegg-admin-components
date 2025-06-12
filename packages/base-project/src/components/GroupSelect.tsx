import {ComponentProps, FC, ReactNode, useEffect, useMemo} from "react";
import {useService} from "@moln/react-ioc";
import {Resources} from "@moln/data-source";
import {Select} from "antd";
import {Group} from "../interfaces";
import {observer} from "mobx-react-lite";

const { Option } = Select;
type SelectProps = ComponentProps<typeof Select>;

interface Props extends SelectProps {
    project: number
    renderItem?: (item: Group) => ReactNode
}

const GroupSelect: FC<Props> = observer((
    {
        project,
        renderItem = (item: Group) => item.name,
        ...props
    }
) => {

    const resources = useService(Resources);
    const groups = useMemo(() => resources.createDataSource<Group>('projects/{project}/groups', {pathParams: {project}, paginator: false}), [])

    useEffect(() => {
        const timeId = setTimeout(() => groups.fetchInit())
        return () => clearTimeout(timeId)
    }, [])

    return (
        <Select
            loading={groups.loading}
            placeholder="选择角色"
            {...props}
        >
            {groups.data.map((item) => (
                <Option value={item.id} key={item.id}>
                    {renderItem(item)}
                </Option>
            ))}
        </Select>
    )
})

export default GroupSelect
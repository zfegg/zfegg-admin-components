import {useService} from "@moln/react-ioc";
import {Resources} from "@moln/data-source";
import {useMemo} from "react";
import {Member} from "./interfaces";


export const useMembers = (project: number) => {
    const resources = useService(Resources)
    return useMemo(() => resources.create<Member>('projects/{project}/members', {project}).createDataSource({paginator: false}), []);
}

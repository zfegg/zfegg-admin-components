import {DependencyConfigInterface, FactoryFunction, InjectionToken} from "@moln/dependency-container";
import {Resources} from "@moln/data-source";
import axios, {AxiosInstance} from "axios";
import {
    Authorization,
    BasicLayout,
    CONFIG_KEY,
    IConfigProvider,
    RouteConfigMap,
    Security,
    Welcome
} from "@zfegg/admin-layout";
import ProjectService from "./services/ProjectService";
import {groupSchema, memberSchema, projectSchema} from "./constants";
import Ajv from "ajv";
import ProjectDropdown from "./components/HeaderContent";
import ProjectLayout from "./layouts/ProjectLayout";
import {AdminProjectList, General, Members} from "./pages";
import {CONFIG_KEY as ADMIN_CONFIG_KEY, IConfigProvider as AdminIConfigProvider} from "@zfegg/admin-admin";

const ConfigProvider = {
    dependencies: {
        singletonFactories: new Map<InjectionToken, FactoryFunction<any>>([
            ['base-project.resources', container => {
                const config = Object.create(container.get<AxiosInstance>('request').defaults)
                config.baseURL = config.baseURL + '/project'
                const http = axios.create(config)
                return new Resources(http)
            }],
            [ProjectService, container => new ProjectService(container.get('request'))],
        ]),
        activationMiddlewares: new Map([
            [Ajv, [
                (container, token, next) => {
                    const instance: Ajv = next();
                    instance.addSchema(memberSchema, 'projects/{project}/members')
                    instance.addSchema(groupSchema, 'projects/{project}/groups')
                    instance.addSchema(projectSchema, 'projects')

                    return instance;
                }
            ]]
        ]),
    } as DependencyConfigInterface,
    routes: {
        application: {
            element: <Security><Authorization><BasicLayout menuRender={false} /></Authorization></Security>,
        },
        'project': {
            priority: 100,
            name: '项目',
            path: "/projects/:project",
            element: <Security><ProjectLayout /></Security>,
            children: {
                home: {
                    path: "/projects/:project/home",
                    name: "首页",
                    component : Welcome
                },
                'settings': {
                    name: "设置",
                    path: "/projects/:project/settings",
                    authorization: true,
                    children: {
                        'general': {
                            name: "基础设置",
                            path: "general",
                            authorization: true,
                            component : General
                        },
                        'members': {
                            name: "项目成员",
                            path: "members",
                            authorization: true,
                            component: Members
                        },
                    }
                },
            },
        },
        'admin': {
            children: {
                'project': {
                    name: "项目管理",
                    path: "/admin/projects",
                    component: AdminProjectList,
                },
            },
        },
    } as RouteConfigMap,
    [CONFIG_KEY] : {
        headerComponents: [
            ProjectDropdown
        ],
    } as IConfigProvider,
    [ADMIN_CONFIG_KEY]: {
        assignRoleDisabled: true,
    } as  AdminIConfigProvider,
}

export default ConfigProvider;

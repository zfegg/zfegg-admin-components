import React, {ComponentProps, FC, useMemo, useState} from "react";
import {useService} from "@moln/react-ioc";
import {
    Authentication,
    BasicLayout,
    Forbidden,
    generatePath,
    matchRoutes,
    NotFound,
    RouteConfig,
    useMatchedRoute
} from "@zfegg/admin-application";
import {useRequest} from "ahooks";
import ProjectService from "../services/ProjectService";
import ProjectAvatar from "../components/ProjectAvatar";
import {Outlet, useLocation, useParams} from "react-router";
import {MenuDataItem, PageLoading} from '@ant-design/pro-layout';
import {AuthUser} from "@zfegg/admin-admin";
import uniq from "lodash/uniq";
import {Link} from "react-router-dom";
import {Card} from "antd";

type Props = ComponentProps<typeof BasicLayout>;

const authorize = (menus: MenuDataItem[], allowedMenus: string[], parent: string[] = []): MenuDataItem[] => {
    return menus.map((oldMenu) => {
        const menu = {...oldMenu}
        const keys = parent.concat(menu.name!)
        const key = keys.join('/')

        if (menu.authorization) {
            if (!allowedMenus.some(menuPath => `${menuPath}/`.indexOf(`${key}/`) === 0)) {
                menu.hideInMenu = true
            }
        }
        if (menu.children) {
            menu.children = authorize(menu.children, allowedMenus, keys)

            if (menu.children.filter(r => r.hideInMenu).length === menu.children.length) {
                menu.hideInMenu = true
            }
        }
        return menu;
    })
}

const ProjectLayout: FC<Props> = (props) => {

    const location = useLocation();
    const ps = useService(ProjectService);
    const projectId = +(useParams().project!)
    const user = useService(Authentication<AuthUser>).user!
    const route = useMatchedRoute()!;
    // console.log(withoutRouteElementKey(route).children?.[1].children?.[1])
    const {loading, data: projects} = useRequest(() => ps.fetchProjects())
    const project = projects?.find(item => item.id === projectId)
    const [menuLoading, setMenuLoading] = useState(true)
    const [menus, setMenus] = useState<MenuDataItem[]>([])

    const forbidden = useMemo(() => {
        if (user.admin) {
            return false;
        }

        const lastMatch = matchRoutes(menus, location.pathname)?.pop()?.route as RouteConfig

        return lastMatch?.authorization && lastMatch.hideInMenu
    }, [location.pathname, menus])

    if (loading) {
        return <PageLoading tip={'加载项目权限'}/>;
    }

    if (projects && !project) {
        return <NotFound/>
    }
    return (
        <BasicLayout
            menu={{
                params: {
                    projectId
                },
                request: async (params, menus) => {
                    if (user.admin) {
                        setMenuLoading(false);
                        return menus;
                    }
                    setMenuLoading(true);
                    try {
                        let allowedMenus = await ps.projectMenus(projectId)
                        user.menus = allowedMenus
                        menus = authorize(menus, allowedMenus, [route.name])
                        setMenus(menus)
                    } finally {
                        setMenuLoading(false)
                    }

                    return menus
                }
            }}
            menuHeaderRender={(dom, _2, props) => {
                if (!project) {
                    return null;
                }
                if (! props) {
                    return <ProjectAvatar project={project} />
                }
                const {isMobile, collapsed} = props
                if (isMobile) {
                    return (
                        <Card size={"small"} title={dom}>
                            <ProjectAvatar project={project} showName />
                        </Card>
                    );
                }
                return <ProjectAvatar project={project} showName={!collapsed}/>;
            }}
            menuItemRender={(menuItemProps, defaultDom) => {
                if (menuItemProps.isUrl || !menuItemProps.path || location.pathname === menuItemProps.path) {
                    return defaultDom;
                }
                return <Link to={generatePath(menuItemProps.path, {project: projectId})}>{defaultDom}</Link>;
            }}
            loading={menuLoading}
            {...props}
        >
            {forbidden ? <Forbidden/> : <Outlet context={{project}}/>}
        </BasicLayout>
    )
}

export default ProjectLayout;

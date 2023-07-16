import {ComponentProps, FC, useMemo, useState} from "react";
import {useService} from "@moln/react-ioc";
import {
    Authentication,
    BasicLayout,
    filterMenus,
    Forbidden,
    getter,
    NotFound,
    withoutRouteElementKey,
} from "@zfegg/admin-layout";
import {useRequest} from "ahooks";
import ProjectService from "../services/ProjectService";
import ProjectAvatar from "../components/ProjectAvatar";
import {Outlet, useLocation, useParams} from "react-router";
import {MenuDataItem, PageLoading} from '@ant-design/pro-layout';
import {useMatches} from "react-router-dom";
import {Card} from "antd";
import {Router} from "@remix-run/router";

type Props = ComponentProps<typeof BasicLayout>;

const ProjectLayout: FC<Props> = (props) => {

    const location = useLocation();
    const ps = useService(ProjectService);
    const projectId = +(useParams().project!)
    const user = useService(Authentication).user!
    const router = useService<Router>('router')
    const matches = useMatches();
    // console.log(withoutRouteElementKey(route).children?.[1].children?.[1])
    const {loading, data: projects} = useRequest(() => ps.fetchProjects())
    const project = projects?.find(item => item.id === projectId)
    const [menuLoading, setMenuLoading] = useState(true)
    const [menus, setMenus] = useState<MenuDataItem[]>([])
    const layoutRoute = useMemo(() => {
        const route = getter(router.routes, matches[1].id.split("-").map(Number))!
        return withoutRouteElementKey(route)
    }, [matches])
    const forbidden = useMemo(() => {
        if (user.admin) {
            return false;
        }

        // const lastMatch = matchRoutes(menus, location.pathname)?.pop()?.route as RouteConfig

        // return lastMatch?.authorization && lastMatch.hideInMenu
    }, [location.pathname, menus])

    if (loading) {
        return <PageLoading tip={'加载商户权限'}/>;
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
                        menus = filterMenus(menus, allowedMenus, [/*route.name*/])
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
            loading={menuLoading}
            route={layoutRoute}
            {...props}
        >
            {forbidden ? <Forbidden/> : <Outlet context={{project}}/>}
        </BasicLayout>
    )
}

export default ProjectLayout;

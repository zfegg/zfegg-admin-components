import React, {createElement, FC, Suspense, useMemo} from 'react';
import {PageLoading, ProLayout, ProLayoutProps} from '@ant-design/pro-layout';
import './BasicLayout.less';
import {generatePath, Link, Outlet, useLocation, useMatches, useParams, useRouteLoaderData} from 'react-router-dom';
import {IConfigProvider} from '../interfaces';
import {useService} from '@moln/react-ioc';
import {CONFIG_KEY} from '../constants';
import {Space} from "antd";
import {Router} from "@remix-run/router";
import {filterMenus, getter, withoutRouteElementKey} from "../utils";
import AvatarDropdown from "../components/AvatarDropdown";
import Authentication from "../services/Authentication";

type Props = {
    headerRightComponents?: IConfigProvider['headerRightComponents'];
    headerComponents?: IConfigProvider['headerComponents'];
} & ProLayoutProps;


const BasicLayout: FC<Props> = (
    {
        children,
        headerRightComponents,
        headerComponents,
        ...props
    }
) => {
    const params = useParams()
    const user = useService(Authentication).user!
    const location = useLocation()
    const routes = useService<Router>('router').routes
    const matches = useMatches()
    const matched = matches[matches.length - 1]
    const data = useRouteLoaderData(matched.id) as Record<string, any> | undefined
    const config = useService<Record<string, any>>('config');
    const appConfig = config[CONFIG_KEY] as IConfigProvider
    const layoutRoute = useMemo(() => {
        const route = getter(routes, matches[0].id.split("-").map(Number))!
        return withoutRouteElementKey(route)
    }, [matches])
    // console.log(router.routes, layoutRoute, data)

    headerRightComponents = headerRightComponents || appConfig.headerRightComponents || [];
    headerComponents = headerComponents || appConfig.headerComponents || [];
    const layoutProps = appConfig.layoutProps || {}

    const actions = headerRightComponents
        .sort((a, b) => (a.index || 0) - (b.index || 0))
        .map((component, idx) => createElement(component, {key: 'key-' + idx, ...props}))

    // console.log(layoutRoute.children?.[1].children?.[1])
    return (
        <ProLayout
            location={location}
            // navTheme={'realDark'}
            layout={'mix'}
            // splitMenus={true}
            // title={''}
            // siderMenuType={"group"}
            // headerTitleRender={(logo) => logo}
            actionsRender={(props) => {
                if (props.isMobile) return [];
                return actions
            }}
            // logo={<Link to={"/"} className="logo-icon"/>}
            headerContentRender={(props, dom) => {
                // console.log(props, dom)
                return (
                    <>
                        {dom}
                        <Space>
                            {headerComponents!
                                .sort((a, b) => (a.index || 0) - (b.index || 0))
                                .map((component, idx) => createElement(component, {key: 'key-' + idx, ...props}))}
                        </Space>
                    </>
                );
            }}
            route={layoutRoute}
            menuItemRender={(menuItemProps, defaultDom) => {
                if (menuItemProps.isUrl || !menuItemProps.path || location.pathname === menuItemProps.path) {
                    return defaultDom;
                }
                return <Link to={generatePath(menuItemProps.path, params)}>{defaultDom}</Link>;
            }}
            // itemRender={(route, _, routes) => {
            //     const {breadcrumbName, path} = route;
            //     const last = routes.indexOf(route) === routes.length - 1;
            //     return last ? <span>{breadcrumbName}</span> : <Link to={path!}>{breadcrumbName}</Link>;
            // }}
            avatarProps={{
                render: () => <AvatarDropdown/>,
            }}
            menu={{
                request: async (params, menus) => {
                    if (user.admin) {
                        return menus;
                    }
                    return filterMenus(menus, user.menus)
                }
            }}
            {...layoutProps}
            {...props}
            {...(data?.layoutProps || {})}
        >
            <Suspense fallback={<PageLoading tip={'加载中...'}/>}>
                {children || <Outlet/>}
            </Suspense>
        </ProLayout>
    );
};

export default BasicLayout;

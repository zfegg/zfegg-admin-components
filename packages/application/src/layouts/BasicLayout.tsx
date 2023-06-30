import React, {createElement, FC, Suspense, useMemo} from 'react';
import {PageLoading, ProLayout, ProLayoutProps} from '@ant-design/pro-layout';
import './BasicLayout.less';
import {Link, Outlet, useLocation, useNavigate} from 'react-router-dom';
import {IConfigProvider, RouteConfig} from '../interfaces';
import {useService} from '@moln/react-ioc';
import {CONFIG_KEY} from '../constants';
import {generatePath, useMatchedRoute} from "../router";
import {Space} from "antd";

type Props = {
    headerRightComponents?: IConfigProvider['headerRightComponents'];
    headerComponents?: IConfigProvider['headerComponents'];
} & ProLayoutProps;


function withoutRouteElementKey(route: RouteConfig) {
    const newRoute = {...route}
    delete newRoute.element
    delete newRoute.component
    if (newRoute.children) {
        newRoute.children = newRoute.children.map(withoutRouteElementKey)
    }

    return newRoute
}

const BasicLayout: FC<Props> = ({
    children,
    headerRightComponents,
    headerComponents,
    ...props
}) => {
    const location = useLocation()
    const route = useMatchedRoute()
    const navigate = useNavigate()
    const config = useService<{ [CONFIG_KEY]: IConfigProvider }>('config')[CONFIG_KEY];
    const layoutRoute = useMemo(() => withoutRouteElementKey(route), [route])

    headerRightComponents = headerRightComponents || config.headerRightComponents || [];
    headerComponents = headerComponents || config.headerComponents || [];
    const layoutProps = config.layoutProps || {}

    const actions =  headerRightComponents
        .sort((a, b) => (a.index || 0) - (b.index || 0))
        .map((component, idx) => createElement(component, {key: 'key-' + idx, ...props}))

    // console.log(layoutRoute.children?.[1].children?.[1])
    return (
        <ProLayout
            location={location}
            // // navTheme={'realDark'}
            layout={'mix'}
            title={'云蟾游戏'}
            headerTitleRender={(logo) => logo}
            actionsRender={(props) => {
                if (props.isMobile) return [];
                return actions
            }}
            logo={<div className="logo-icon" />}
            onMenuHeaderClick={() => {
                navigate('/');
            }}
            headerContentRender={(props) => (
                <Space>
                    {headerComponents!
                        .sort((a, b) => (a.index || 0) - (b.index || 0))
                        .map((component, idx) => createElement(component, {key: 'key-' + idx, ...props}))}
                </Space>
            )}
            route={layoutRoute}
            menuItemRender={(menuItemProps, defaultDom) => {
                if (menuItemProps.isUrl || !menuItemProps.path || location.pathname === menuItemProps.path) {
                    return defaultDom;
                }
                return <Link to={generatePath(menuItemProps.path)}>{defaultDom}</Link>;
            }}
            itemRender={(route, _, routes) =>　{
                const {breadcrumbName, path} = route;
                const last = routes.indexOf(route) === routes.length - 1;
                return last ? <span>{breadcrumbName}</span> : <Link to={path}>{breadcrumbName}</Link>;
            }}
            {...layoutProps}
            {...props}
        >
            <Suspense fallback={<PageLoading tip={'加载中...'} />}>
                {children || <Outlet />}
            </Suspense>
        </ProLayout>
    );
};

export default BasicLayout;

import type {ComponentProps, ComponentType} from 'react';
import type {ProLayout, MenuDataItem} from '@ant-design/pro-layout';
import type {History} from 'history';
import {RouteObject} from "react-router";
import {MenuProps} from "antd";

export type HeaderViewProps = Exclude<
    Required<ComponentProps<typeof ProLayout>['rightContentRender']>,
    undefined | false
>;


export interface AvatarDropdownProps {
    menuItems?: MenuProps['items']
    git?: {
        tag: string,
        hash: string
    }
}

export interface IConfigProvider {
    headerRightComponents?: (ComponentType<HeaderViewProps> & {
        index?: number;
    })[];
    headerComponents?: (ComponentType<HeaderViewProps> & { index?: number })[];
    // routeWrappers?: Parameters<typeof renderRoutes>[0];
    redirectLogin?: (history: History, href?: string) => void;
    avatarDropdownProps?: AvatarDropdownProps
    layoutProps?: ComponentProps<typeof ProLayout>
    disabledzfeggOAuth2?: boolean
}

export interface RouteConfig extends RouteObject, Omit<MenuDataItem, 'children'> {
    children?: RouteConfig[]
    priority?: number; // 路由执行优先级排序
    component?: ComponentType<any>
}

export interface RouteConfigItem extends Omit<RouteConfig, 'children'> {
    children?: RouteConfigMap
}

export type RouteConfigMap = Record<string, RouteConfigItem>;

export interface User {
    real_name: string;
    avatar: string | null;
    admin: boolean;
    [key: string]: any;
}

export interface AuthenticationInterface<U extends User> {
    user: U | undefined | null;
    fetchUser(): Promise<U>;
    destroy(): Promise<any>;
}

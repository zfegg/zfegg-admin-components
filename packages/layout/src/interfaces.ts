import type {ComponentProps, ComponentType} from 'react';
import type {MenuDataItem, ProLayout} from '@ant-design/pro-layout';
import {RouteObject} from "react-router";
import {MenuProps} from "antd";
import {LoaderFunctionArgs} from "react-router-dom";
import {DependencyContainerInterface} from "@moln/dependency-container";
import type {Router} from "@remix-run/router";

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
    redirectLogin?: (router: Router) => void;
    avatarDropdownProps?: AvatarDropdownProps
    layoutProps?: ComponentProps<typeof ProLayout>
}

export type RouteConfig = RouteObject & Omit<MenuDataItem, 'children'> & {
    children?: RouteConfig[]
    priority?: number; // 路由执行优先级排序
    authorization?: boolean
}

export interface RouteConfigItem extends Omit<RouteConfig, 'children'> {
    children?: RouteConfigMap
    component?: ComponentType<any>
}

export type RouteConfigMap = Record<string, RouteConfigItem>;

export interface LoaderArgs extends LoaderFunctionArgs {
    context: DependencyContainerInterface
}

export type LoaderReturn<T extends (...args: any) => any> = Awaited<ReturnType<T>>

export interface User {
    real_name: string;
    avatar: string | null;
    admin: boolean;
    menus: string[];
    [key: string]: any;
}
export interface AuthenticationInterface<U extends User> {
    user: U | undefined | null;
    fetchUser(): Promise<U>;
    destroy(): Promise<any>;
    hasPermission(name: string): boolean
}

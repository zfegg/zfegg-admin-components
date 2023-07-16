import mergeWith from 'lodash/mergeWith';
import type {Router} from '@remix-run/router';
import {RouteConfig} from "../interfaces"
import {MenuDataItem} from "@ant-design/pro-layout";

export function gotoLogin(router: Router) {
    router.navigate('/login');
}

export function configMerge(objValue: any, srcValue: any): any | undefined {
    if (Array.isArray(objValue)) {
        return objValue.concat(srcValue);
    }

    if (objValue instanceof Map && srcValue instanceof Map) {
        srcValue.forEach((value, key) => {
            if (objValue.has(key)) {
                const val = mergeWith({x: objValue.get(key)}, {x: value}, configMerge).x;
                objValue.set(key, val);
            } else {
                objValue.set(key, value);
            }
        });
        return objValue;
    }

    // 替换 React 组件
    if (typeof srcValue === "object" && srcValue.$$typeof) {
        return srcValue
    }
}

let baseAttachmentUrl: string = "";
export function setBaseAttachmentUrl(url: string) {
    baseAttachmentUrl = url
}

export function attachmentUrl(src: string) {
    return /^https?:\/\//.test(src) ? src : (baseAttachmentUrl + src)
}


export const getter = (data: RouteConfig[], keys: number[]): RouteConfig | undefined => {
    const key = keys.shift()
    if (key === undefined) {
        return undefined;
    }
    const target = data[key]

    if (keys.length && target) {
        return getter(target.children || [], keys)
    }

    return target;
}


export function withoutRouteElementKey(route: RouteConfig) {
    const newRoute = {...route}
    delete newRoute.element
    delete newRoute.component
    if (newRoute.children) {
        newRoute.children = newRoute.children.map(withoutRouteElementKey)
    }

    return newRoute
}


export const filterMenus = (menus: MenuDataItem[], allowMenus: string[], parent: string[] = []): MenuDataItem[] => {
    return menus.map((oldMenu) => {
        const menu = {...oldMenu}
        const keys = parent.concat(menu.name!)
        const key = keys.join('/')

        if (menu.authorization) {
            if (!allowMenus.some(menuPath => `${menuPath}/`.indexOf(`${key}/`) !== -1)) {
                menu.hideInMenu = true
            }
        }
        if (menu.children) {
            menu.children = filterMenus(menu.children, allowMenus, keys)

            if (menu.children.filter(r => r.hideInMenu).length === menu.children.length) {
                menu.hideInMenu = true
            }
        }
        return menu;
    })
}

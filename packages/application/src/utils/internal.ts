import {RouteConfig, RouteConfigMap} from "../interfaces";
import {createElement} from "react";

export function toArrayRouteConfig(routes: RouteConfigMap, parentName: string = ''): RouteConfig[] {
    return Object.entries(routes)
        .sort(([, a], [, b]) => (b.priority || 0) - (a.priority || 0))
        .map(([name, {children, component, ...route}]) => {
            const key = parentName ? parentName + '.' + name : name;
            if (!route.key) {
                route.key = key;
            }

            let newRoute: RouteConfig = route as RouteConfig;
            if (children) {
                newRoute = {
                    ...route,
                    children: toArrayRouteConfig(children, key),
                } as RouteConfig;
            }
            if (component) {
                newRoute.element = createElement(component, {route: newRoute})
            }

            return newRoute;
        });
}
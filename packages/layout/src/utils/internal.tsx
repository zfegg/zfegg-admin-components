import {RouteConfig, RouteConfigMap} from "../interfaces";
import {RouteObject} from "react-router";
import {DependencyContainerInterface} from "@moln/dependency-container";
import {LoaderFunction} from "react-router-dom";

const lazyWrapper = (lazy: Required<RouteObject>['lazy'], container: DependencyContainerInterface) => {
    return async () => {
        const result = await lazy()
        let loader: LoaderFunction | undefined
        if (result.loader) {
            loader = (props) => {
                props.context = container
                return result.loader!(props)
            }
        }

        return {
            ...result,
            loader,
        }
    }
}

export function toArrayRouteConfig(routes: RouteConfigMap, container: DependencyContainerInterface, parentName: string = ''): RouteConfig[] {
    return Object.entries(routes)
        .sort(([, a], [, b]) => (b.priority || 0) - (a.priority || 0))
        .map(([name, {children, lazy, component, ...route}]) => {
            const key = parentName ? parentName + '.' + name : name;
            if (!route.key) {
                route.key = key;
            }

            const newRoute: RouteObject = {...route} as RouteObject;
            if (children) {
                newRoute.children = toArrayRouteConfig(children, container, key)
            }
            if (component) {
                const Component = component;
                newRoute.element = <Component route={newRoute} />
            }
            if (lazy) {
                newRoute.lazy = lazyWrapper(lazy, container)
            }
            return newRoute;
        });
}
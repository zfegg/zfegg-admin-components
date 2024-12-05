import {RouteConfig, RouteConfigMap} from "../interfaces";
import {RouteObject, LoaderFunction} from "react-router";
import {DependencyContainerInterface} from "@moln/dependency-container";

type LazyFn = Required<RouteObject>['lazy']
const lazyWrapper = (lazy: LazyFn, container: DependencyContainerInterface): LazyFn => {
    return (async () => {
        const result = await lazy()
        let loader: LoaderFunction | undefined
        let tmpLoader = result.loader
        if (typeof tmpLoader == "function") {
            loader = (props) => {
                props.context = container
                return tmpLoader(props)
            }
        }

        return {
            ...result,
            loader,
        }
    }) as LazyFn
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
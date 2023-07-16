import {FC, ReactNode, useMemo} from "react";
import {RouteConfig} from "../interfaces";
import {useService} from "@moln/react-ioc";
import {useMatches} from 'react-router-dom';
import {Router} from "@remix-run/router";
import Authentication from "../services/Authentication";
import {Forbidden} from "../pages";

const getter = (routes: RouteConfig[], keys: number[]): RouteConfig => {
    let target: RouteConfig[] = routes
    let route: RouteConfig
    const names: string[] = []
    keys.forEach((idx) => {
        route = target[idx]
        target = route.children!
        names.push(route.name!)
    })

    route!.menuName = names

    return route!;
}

const Authorization: FC<{ children: ReactNode }> = ({children}) => {
    const routes = useService<Router>('router').routes as RouteConfig[]
    const matches = useMatches();
    const matched = matches[matches.length - 1]
    const user = useService<Authentication>(Authentication)

    const forbidden = useMemo(() => {
        const route = getter(routes, matched.id.split("-").map(Number))

        if (!route.authorization || user.hasPermission(route.menuName.join("/"))) {
            return null;
        }
        return <Forbidden/>
    }, [matched])

    return forbidden ?? children as any
}

export default Authorization

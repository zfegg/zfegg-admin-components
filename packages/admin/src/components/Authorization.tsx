import {FC, ReactNode, useMemo} from "react";
import {AuthUser} from "../interfaces";
import {Authentication, Forbidden, RouteConfig, useMatchedRoute, matchRoutes} from "@zfegg/admin-application";
import {useService} from "@moln/react-ioc";
import {useLocation} from 'react-router-dom';

const Authorization: FC<{children: ReactNode}> = ({children}) => {
    const route = useMatchedRoute();
    const location = useLocation();
    const user = useService<Authentication<AuthUser>>(Authentication).user!

    const forbidden = useMemo(() => {
        const authorize = (routes: RouteConfig[], parent: string[] = []) => {
            routes.forEach((route) => {

                const keys = (parent || []).concat(route.name!)
                const key = keys.join('/')

                if (route.authorization) {
                    if (! user.menus.filter(menu => `${menu}/`.indexOf(`${key}/`) !== -1).length) {
                        route.hideInMenu = true
                    }
                }
                if (route.children) {
                    authorize(route.children, keys)

                    if (route.children.filter(r => r.hideInMenu).length === route.children.length) {
                        route.hideInMenu = true
                    }
                }
            })
        }

        if (! user.admin && route?.children) {
            authorize(route.children as RouteConfig[])
        }
        const lastMatch = matchRoutes([route], location.pathname)?.pop()?.route as RouteConfig

        if (lastMatch?.authorization && lastMatch.hideInMenu) {
            return <Forbidden />
        }
    }, [route])

    return forbidden ?? children as any
}

export default Authorization

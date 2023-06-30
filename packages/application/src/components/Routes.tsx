import {FC} from "react";
import {useRoutes} from "../router";
import {useService} from "@moln/react-ioc";
import {RouteConfigMap} from "../interfaces";
import {toArrayRouteConfig} from "../utils/internal";

const Routes: FC = () => {
    const config = useService<{routes: RouteConfigMap}>('config')
    const routes = toArrayRouteConfig(config['routes'])

    return useRoutes(routes)
}

export default Routes

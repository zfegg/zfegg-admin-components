import {DependencyConfigInterface, FactoryFunction, InjectionToken,} from '@moln/dependency-container';
import Authentication from './services/Authentication';
import BasicLayout from './layouts/BasicLayout';
import AvatarDropdown from './components/AvatarDropdown';
import {CONFIG_KEY} from './constants';
import {IConfigProvider, RouteConfigMap} from './interfaces';
import Security from './components/Security';
import {Welcome, Login} from "./pages";
import {toArrayRouteConfig} from "./utils/internal";
import ErrorBoundary from "./components/ErrorBoundary";
import {createHashRouter} from "react-router-dom";


const ConfigProvider: Record<any, any> = {
    dependencies: {
        singletonFactories: new Map<InjectionToken, FactoryFunction<any>>([
            [Authentication, (container) => new Authentication(container.get('request'))],
            ['router', (container) => createHashRouter(toArrayRouteConfig(container.get<Record<string, any>>('config')['routes'], container))],
        ]),
    } as DependencyConfigInterface,
    routes: {
        'login': {
            "name": "系统管理",
            "path": "/login",
            "element": <Login/>,
            priority: 1000,
        },
        application: {
            path: '/',
            name: '应用',
            element: <Security><BasicLayout /></Security>,
            ErrorBoundary,
            children: {
                home: {
                    name: '首页',
                    path: '/',
                    index: true,
                    element: <Welcome />,
                },
            },
        },
    } as RouteConfigMap,
    [CONFIG_KEY]: {
        // headerRightComponents: [AvatarDropdown],
    } as IConfigProvider,
};

export default ConfigProvider;

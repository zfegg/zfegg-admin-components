import {
    DependencyConfigInterface,
    FactoryFunction,
    InjectionToken,
    ServiceMiddleware,
} from '@moln/dependency-container';
import Authentication from './services/Authentication';
import BasicLayout from './layouts/BasicLayout';
import RequestErrorMiddleware from './container/RequestErrorMiddleware';
import {createHashHistory} from 'history';
import AvatarDropdown from './components/AvatarDropdown';
import {gotoLogin} from './utils';
import {CONFIG_KEY} from './constants';
import {IConfigProvider, RouteConfigMap} from './interfaces';
import Security from './components/Security';
import {NotFound, Welcome} from "./pages";


const ConfigProvider: Record<any, any> = {
    dependencies: {
        singletonFactories: new Map<InjectionToken, FactoryFunction<any>>([
            [Authentication, (container) => new Authentication(container.get('request'))],
            ['history', () => createHashHistory()],
        ]),
        activationMiddlewares: new Map<InjectionToken, ServiceMiddleware<any>[]>([
            ['request', [RequestErrorMiddleware]],
        ]),
    } as DependencyConfigInterface,
    routes: {
        application: {
            path: '/',
            name: '应用',
            element: <Security><BasicLayout /></Security>,
            children: {
                home: {
                    name: '首页',
                    path: '/',
                    index: true,
                    element: <Welcome />,
                },
            },
        },
        '404': {
            path: '/(.*)',
            name: '页面不存在!',
            element: <NotFound />,
            priority: -10000,
            hideInMenu: true,
        },
    } as RouteConfigMap,
    [CONFIG_KEY]: {
        headerRightComponents: [AvatarDropdown],
        redirectLogin: gotoLogin,
    } as IConfigProvider,
};

export default ConfigProvider;

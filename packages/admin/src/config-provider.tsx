import {DependencyConfigInterface, FactoryFunction, InjectionToken} from "@moln/dependency-container";
import {lazy} from "react";
import {
    Authorization,
    BasicLayout,
    CONFIG_KEY,
    IConfigProvider as ApplicationIConfigProvider,
    RouteConfigMap,
    Security,
    Welcome
} from "@zfegg/admin-layout";
import HeadRightAdmin from "./components/HeadRightAdmin";
import {CONFIG_KEY as ADMIN_CONFIG_KEY, roleSchema, userSchema} from './constants';
import {Link} from "react-router-dom";
import {SettingOutlined} from "@ant-design/icons";
import ProfileService from "./services/ProfileService";
import Login from "./pages/Login";
import {IConfigProvider} from "./interfaces";
import {Resources} from "@moln/data-source";

const ConfigProvider = {
    dependencies: {
        singletonFactories: new Map<InjectionToken, FactoryFunction<any>>([
            [ProfileService, container => new ProfileService(container.get('request'))]
        ]),
        activationMiddlewares: new Map([
            [Resources, [
                (_, _1, next) => {
                    const instance: Resources = next();
                    instance.schemas.add('admin/users', userSchema);
                    instance.schemas.add('admin/roles', roleSchema);

                    return instance;
                }
            ]]
        ])
    } as DependencyConfigInterface,
    routes: {
        'login': {
            "name": "系统管理",
            "path": "/login",
            "element": <Login/>,
            priority: 1000,
        },
        profile: {
            path: '/profile',
            name: '应用',
            element: <Security><BasicLayout/></Security>,
            children: {
                settings: {
                    path: '/profile/settings',
                    name: '个人设置',
                    index: true,
                    Component: lazy(() => import('./pages/profile/Settings')),
                },
                password: {
                    path: '/profile/password',
                    name: '密码设置',
                    Component: lazy(() => import('./pages/profile/Password')),
                },
                bindings: {
                    path: '/profile/bindings',
                    name: '账号绑定',
                    Component: lazy(() => import('./pages/profile/Bindings')),
                },
            },
        },
        'admin': {
            "name": "系统管理",
            "path": "/admin",
            "element": <Security><Authorization><BasicLayout/></Authorization></Security>,
            priority: 1000,
            authorization: true,
            children: {
                'home': {
                    "name": "管理中心",
                    "path": "/admin/home",
                    authorization: true,
                    Component: Welcome,
                },
                'users': {
                    "name": "用户管理",
                    "path": "/admin/users",
                    authorization: true,
                    Component: lazy(() => import('./pages/UserList')),
                },
                'roles': {
                    "name": "角色管理",
                    "path": "/admin/roles",
                    authorization: true,
                    Component: lazy(() => import('./pages/RoleList')),
                },
            }
        },
        "application": {
            element: <Security><Authorization><BasicLayout /></Authorization></Security>,
        }
    } as RouteConfigMap,
    [CONFIG_KEY]: {
        headerRightComponents: [
            HeadRightAdmin,
        ],
        avatarDropdownProps: {
            menuItems: [
                {key: "settings", icon: <SettingOutlined/>, label: <Link to={'/profile/settings'}>个人设置</Link>},
            ]
        },
    } as ApplicationIConfigProvider,
    [ADMIN_CONFIG_KEY]: {
        assignRoleDisabled: false
    } as IConfigProvider
}
export default ConfigProvider;

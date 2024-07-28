import {DependencyConfigInterface, FactoryFunction, InjectionToken} from "@moln/dependency-container";
import {lazy} from "react";
import Ajv from "ajv";
import {RouteConfigMap, CONFIG_KEY, IConfigProvider, Security, Welcome} from "@zfegg/admin-layout";
import {book} from "./models/book";
import Help from "./components/Help";
import DemoButton from "./components/DemoButton";
import BellButton from "./components/BellButton";
import Bell2Button from "./components/Bell2Button";

const ConfigProvider = {
    dependencies: {
        singletonFactories: new Map<InjectionToken, FactoryFunction<any>>([
        ]),
        activationMiddlewares: new Map([
            [Ajv, [
                (_, _1, next) => {
                    const instance: Ajv = next();
                    instance.addSchema(book, 'book/books')
                    // instance.addSchema(batch, 'game-card/batches')

                    return instance;
                }
            ]]
        ])
    } as DependencyConfigInterface,
    routes: {
        'application': {
            // component:
            children: {
                'book': {
                    name: "书本管理",
                    path: "/book",
                    children: {
                        'home': {
                            name: "首页1",
                            path: "/book/",
                            index: true,
                            component : lazy(() => import('./pages/Home')),
                        },
                        'CursorPaginationTable': {
                            name: "CursorPaginationTable",
                            path: "/book/CursorPaginationTable",
                            component : lazy(() => import('./pages/CursorPaginationTable'))
                        },
                        'pro-table': {
                            name: "ProTable",
                            path: "/book/pro-table",
                            authorization: true,
                            component : lazy(() => import('./pages/TestProTable'))
                        },
                        'table': {
                            name: "Table",
                            path: "/book/table",
                            authorization: true,
                            component : lazy(() => import('./pages/TestTable')),
                        },
                    }
                },
            },
        },
    } as RouteConfigMap,
    [CONFIG_KEY]: {
        headerRightComponents: [
            BellButton,
            Bell2Button,
            Help,
        ],
        headerComponents: [
            Help,
            DemoButton,
            BellButton,
            Bell2Button,
        ],
        // disabledzfeggOAuth2: true
    } as IConfigProvider
}

export default ConfigProvider;
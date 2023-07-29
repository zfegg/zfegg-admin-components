import {defineConfig, mergeConfig, UserConfig} from 'vite'
import {baseConfig} from "./scripts/vite.utils";

import {resolve} from 'path';

// https://vitejs.dev/config/
export default defineConfig(() => {
    const config = mergeConfig(baseConfig, {
        optimizeDeps: {
            include: ["react/jsx-runtime"],
        },
        resolve: {
            //  "alias": {
            //     "@zfegg/admin-admin": "./packages/admin",
            //     "@zfegg/data-source-components": "./packages/data-source-components",
            //     "@zfegg/admin-layout": "./packages/layout"
            //   },
            alias: [
                // {find: '@zfegg/admin-admin/src', replacement: resolve(__dirname, './packages/admin/src')},
                {find: '@zfegg/admin-admin', replacement: resolve(__dirname, './packages/admin/src')},
                // {find: '@zfegg/admin-layout/src', replacement: resolve(__dirname, './packages/layout/src'),},
                {find: '@zfegg/admin-layout', replacement: resolve(__dirname, './packages/layout/src'),},
                // {find: '@zfegg/admin-data-source-components/src', replacement: resolve(__dirname, './packages/data-source-components/src'),},
                {find: '@zfegg/admin-data-source-components', replacement: resolve(__dirname, './packages/data-source-components/src'),},
                // {find: '@zfegg/admin-base-project/src', replacement: resolve(__dirname, './packages/base-project/src'),},
                {find: '@zfegg/admin-base-project', replacement: resolve(__dirname, './packages/base-project/src'),},
            ],
        },
        server: {
            proxy: {
                '^/(api|zfegg|uploads)/.*': {
                    target: 'http://localhost/zfegg/zfegg-admin-components/backend/public',
                    changeOrigin: true,
                },
            }
        }
    } as UserConfig)
    return config
})

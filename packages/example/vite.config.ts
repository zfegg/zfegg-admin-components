import {defineConfig, mergeConfig, UserConfig} from "vite";
import {baseConfig} from "../../scripts/vite.utils";
import {resolve} from "path";

export default defineConfig(() => {
    const config = mergeConfig(baseConfig, {
        optimizeDeps: {
            include: ["react/jsx-runtime"],
        },
        server: {
            proxy: {
                '^/(api|zfegg|uploads)/.*': {
                    target: 'http://localhost/zfegg/zfegg-admin-components/backend/public/index.php',
                    changeOrigin: true,
                },
            }
        },
        resolve: {
            alias: [
                {
                    find: /^@zfegg/,
                    replacement: '@zfegg',
                    customResolver: (name: string, ...args: any) => {
                        const packageDirName = name.replace("@zfegg/admin-", "")
                        return resolve(__dirname, `../${packageDirName}/src/index.ts`)
                    },
                },
            ],
        },
    } as UserConfig)
    return config
})

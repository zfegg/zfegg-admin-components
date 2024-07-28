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
                    target: 'http://localhost/zfegg/zfegg-admin-components/backend/public',
                    changeOrigin: true,
                },
            }
        }
    } as UserConfig)
    return config
})

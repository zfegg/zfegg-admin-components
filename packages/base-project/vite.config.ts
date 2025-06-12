import {defineConfig, mergeConfig, UserConfig} from "vite";
import {libBaseConfig, safeName} from "../../scripts/vite.utils";

import path from "path";
import packageJson from "./package.json";

export default defineConfig((env) => {
    return mergeConfig(libBaseConfig(env), {
        build: {
            lib: {
                entry: path.resolve(__dirname, "./src/index.ts"),
                name: safeName(packageJson.name),
            },
            rollupOptions: {
            }
        },
    } as UserConfig);
});

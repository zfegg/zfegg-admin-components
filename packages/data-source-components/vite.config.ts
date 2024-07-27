import {defineConfig, mergeConfig, UserConfig} from "vite";
import {libBaseConfig, safeName} from "../../scripts/vite.utils";
import * as fsExtra from "fs-extra";

const path = require("path");
const packageJson = require("./package.json");

fsExtra.emptyDirSync(__dirname + "/types");

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

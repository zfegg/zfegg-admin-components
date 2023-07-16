import {mergeConfig, Plugin, UserConfig, UserConfigFn} from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import path from "path";
import {ModuleFormat, OutputOptions} from "rollup";
import {getBabelOutputPlugin} from '@rollup/plugin-babel';
import babelImportPlugin from "./babelImportPlugin";
import svgr from "@svgr/rollup";
import {theme} from "antd";
import {convertLegacyToken} from "@ant-design/compatible";

const {defaultAlgorithm, defaultSeed} = theme;

const mapToken = defaultAlgorithm(defaultSeed);
const v4Token = convertLegacyToken(mapToken);


const postCssUrl = require("postcss-url");
const {DEFAULT_EXTENSIONS} = require("@babel/core");
const sourcePath = path.resolve(process.cwd(), "./src").replace(/\\/g, "/");
const outputPath = (orgPath: string | null) => {
    if (!orgPath) return "";
    let outputPath = path.dirname(orgPath).replace(sourcePath, "");
    outputPath = outputPath === "/" ? "" : outputPath.replace(/^\//, "") + "/";

    return outputPath;
};


export const rollupOutput = (format: ModuleFormat): OutputOptions => {

    return ({
        dir: `dist`,
        format,
        chunkFileNames: (chunkInfo) => `${format}/${outputPath(chunkInfo.facadeModuleId)}[name].js`,
        entryFileNames: `${format}/[name].js`,
        plugins: format === 'es'
            ? [
                getBabelOutputPlugin({
                    plugins: [
                        ["transform-rename-import", {
                            replacements: [
                                {original: 'lodash(?!/fp)', replacement: 'lodash-es'},
                                {original: 'antd\\/lib', replacement: 'antd/es'}
                            ]
                        }],
                    ]
                })
            ]
            : [],
    });
};

export const safeName = (name: string) => {
    return name.replace(/[/]/g, "-").replace(/@/g, "");
};

const eslintFile = path.resolve(__dirname, "../.eslintrc.js");

const viteBabelImport: Plugin = {
    ...babelImportPlugin({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx']
    }),
    apply: () => true,
}

export const baseConfig = {
    plugins: [
        react(),
        eslint({include: [eslintFile]}),
        {
            ...svgr({
                ref: true,
                memo: true,
            }),
            apply: () => true
        }
    ],
    resolve: {
        alias: [
            {find: /^~/, replacement: ""},
        ],
    },
    css: {
        preprocessorOptions: {
            less: {
                modifyVars: v4Token,
                javascriptEnabled: true,
            },
        },
    },
}

export const libBaseConfig = ((env) => {
    return mergeConfig(baseConfig, {
        esbuild: {
            drop: env.mode === "production" ? ["console", "debugger"] : undefined,
            charset: 'utf8',
        },
        plugins: [
            // viteBabelImport,
            // typescript({
            //     exclude: [
            //         '**/*.spec.ts',
            //         '**/*.test.ts',
            //         '**/*.spec.tsx',
            //         '**/*.test.tsx',
            //         // TS defaults below
            //         'node_modules',
            //     ]
            // }),
        ],
        build: {
            minify: false,
            sourcemap: true,
            rollupOptions: {
                external: (id) => {
                    return !id.startsWith(".") && !path.isAbsolute(id);
                },
                output: [
                    rollupOutput("cjs"),
                    rollupOutput("es"),
                ],
            },
        },
        resolve: {
            alias: [
                {
                    find: /^~@zfegg/,
                    replacement: '~@zfegg',
                    customResolver: () => null,
                },
            ],
        },
        css: {
            postcss: {
                plugins: [
                    postCssUrl([
                        {
                            url: "rebase",
                            assetsPath: path.resolve(sourcePath, "../dist/"),
                        },
                    ]),
                ],
            },
        },
    } as UserConfig);
}) as UserConfigFn;

import {mergeConfig, UserConfig, UserConfigFn} from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import path, {resolve} from "path";
import {ModuleFormat, OutputOptions} from "rollup";
import {getBabelOutputPlugin} from '@rollup/plugin-babel';
// import babelImportPlugin from "./babelImportPlugin";
// import svgr from "@svgr/rollup";
import svgr from "vite-plugin-svgr";
import {theme} from "antd";
import {convertLegacyToken} from "@ant-design/compatible";

const {defaultAlgorithm, defaultSeed} = theme;

const mapToken = defaultAlgorithm(defaultSeed);
const v4Token = convertLegacyToken(mapToken);


const postCssUrl = require("postcss-url");
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

const alias = [
    // {find: '@zfegg/admin-admin/src', replacement: resolve(__dirname, './packages/admin/src')},
    {find: '@zfegg/admin-admin', replacement: resolve(__dirname, '../packages/admin/src')},
    // {find: '@zfegg/admin-layout/src', replacement: resolve(__dirname, './packages/layout/src'),},
    {find: '@zfegg/admin-layout', replacement: resolve(__dirname, '../packages/layout/src'),},
    // {find: '@zfegg/admin-data-source-components/src', replacement: resolve(__dirname, './packages/data-source-components/src'),},
    {find: '@zfegg/admin-data-source-components', replacement: resolve(__dirname, '../packages/data-source-components/src'),},
    // {find: '@zfegg/admin-base-project/src', replacement: resolve(__dirname, './packages/base-project/src'),},
    {find: '@zfegg/admin-base-project', replacement: resolve(__dirname, '../packages/base-project/src'),},
];

export const baseConfig = {
    plugins: [
        react(),
        eslint({include: [eslintFile]}),
        svgr({include: '**/*.svg'}),
    ],
    resolve: {
        alias: [
            {find: /^~/, replacement: ""},
            ...alias,
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
            // alias: [
            //     {
            //         find: /^~@zfegg/,
            //         replacement: '~@zfegg',
            //         customResolver: () => null,
            //     },
            // ],
            alias,
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

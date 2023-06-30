import {createBabelInputPluginFactory} from '@rollup/plugin-babel';

export default createBabelInputPluginFactory((babelCore) => {
    return {
        config(cfg , {code, customOptions}) {
            return {
                ...cfg.options,
                plugins: [
                    ...(cfg.options.plugins || []),
                    ["import", {
                        "libraryName": "antd",
                        "libraryDirectory": "lib",
                        "style": true,
                    }],
                ],
            };
        },
    };
});
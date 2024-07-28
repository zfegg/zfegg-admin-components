import mergeWith from 'lodash/mergeWith';
import {ConfigProvider as AdminApp, CONFIG_KEY as applicationConfigKey, configMerge, IConfigProvider} from '@zfegg/admin-layout'
import {ConfigProvider as AdminAdmin} from '@zfegg/admin-admin'
// import {ConfigProvider as AdminBaseProject} from '@zfegg/admin-base-project'
import BookConfigProvider from '../modules/book/config-provider'

const moduleConfigs: object[] = [
    AdminApp,
    AdminAdmin,
    // AdminBaseProject,
    BookConfigProvider,
    {
        [applicationConfigKey]: {
            avatarDropdownProps: {
                git: {
                    tag: "GIT_BRANCH",
                    hash: "GIT_HASH",
                }
            },
        } as IConfigProvider
    }
];
const configs: Record<any, any> = {
};

moduleConfigs.forEach((config) => {
    mergeWith(configs, config, configMerge);
});

export default configs;

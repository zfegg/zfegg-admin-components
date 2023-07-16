import config from './config';
import DependencyContainer, {
    Lifecycle,
    ReflectionBasedAbstractFactory
} from "@moln/dependency-container";
import baseServiceProvider from './service-provider';

const container = new DependencyContainer();

container.configure({
    abstractFactories: [
        [new ReflectionBasedAbstractFactory(), Lifecycle.SINGLETON],
    ],
});
container.configure(config.dependencies);
container.registerInstance('config', config);

baseServiceProvider(container);
console.log('config: ', config);

export default container;

import DependencyContainer, {
    Lifecycle,
    ReflectionBasedAbstractFactory
} from "@moln/dependency-container";
import {DependencyContainerInterface} from "@moln/dependency-container";
import Axios from "axios";
import {Resources} from "@moln/data-source";
import Ajv from "ajv";
import qs from 'qs';
import addFormats from "ajv-formats"
import {AjvSchemaList} from '@moln/data-source'

function baseServiceProvider(container: DependencyContainerInterface) {
    container.register('request', () => {
        return Axios.create({
            baseURL: '/api',
            timeout: 5000,
            headers: {'x-requested-with': 'XMLHttpRequest'},
            paramsSerializer: {
                serialize: params => {
                    return qs.stringify(params, {skipNulls: true})
                }
            }
        });
    });
    container.register(Ajv, _ => {
        const ajv = new Ajv({
            strict: false,
            useDefaults: true,
            coerceTypes: true,
        });

        addFormats(ajv)

        return ajv
    })

    container.register(Resources, container => new Resources(container.get('request'), new AjvSchemaList(container.get(Ajv))))

}

const container = new DependencyContainer();

container.configure({
    abstractFactories: [
        [new ReflectionBasedAbstractFactory(), Lifecycle.SINGLETON],
    ],
});

baseServiceProvider(container);

export default container;

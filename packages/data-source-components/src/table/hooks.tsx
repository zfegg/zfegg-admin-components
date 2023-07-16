import {useSearchParams} from "react-router-dom";
import {NavigateOptions, useNavigate} from "react-router";
import {IDataSource} from "@moln/data-source";
import isEmpty from "lodash/isEmpty";
import {useEffect} from "react";
import isArray from "lodash/isArray";
import {filterEmpty, fromDataSourceFilterToFilterValues, fromFilterValuesToDSFilters, isEmptyValue} from "./internal/utils";
import {observe, toJS} from "mobx";

const jsonParse = JSON.parse;

function querySetOrDel(query: URLSearchParams, key: string, data: any) {
    if (typeof data === "number" || typeof data === 'string') {
        query.set(key, data as any)
        return;
    } else if (typeof data === "object" && ! isEmpty(data)) {
        query.set(key, JSON.stringify(data))
        return;
    } else {
        query.delete(key)
    }
}

function normalizeNumber(value: string | null) {
    let result = jsonParse(value!)
    if (typeof result === 'number') {
        return result
    }
    return null;
}


type Keys = keyof IDataSource<any>
type PageKey = 'page' | 'pageSize' | 'cursor'


/**
 * 解码特殊URL字符
 * @param str
 */
function decodeSpecURI(str: string) {
    return str.replace(
        /%([0-9A-F]{2})/ig,
        (a, b) => {
            const str = String.fromCharCode(parseInt(b, 16));
            return "[]{}':,\"".indexOf(str) === -1 ? a : str
        }
    )
}

/**
 * 监听路由
 */
export function useDataSourceBindSearch<T extends Record<string, any>>(
    dataSource: IDataSource<T>,
    navigateOptions?: NavigateOptions,
) {
    let navigate = useNavigate();
    const [query] = useSearchParams();
    const setURLSearchParams = (query: URLSearchParams) => {
        console.log(query)
        navigate('?' + decodeSpecURI(query.toString()), navigateOptions)
    }

    // 监听路由参数 绑定 DataSource
    const trySet = (
        key: Keys,
        setter: (str: string | null) => any,
    ) => {
        const str = query.get(key)
        useEffect(() => {
            try {
                setter(str);
                console.log('try set:', key, str, );
            } catch (e) {
                console.error('try set error:', e)
            }
        }, [str])
        return str;
    }

    const filterStr = trySet('filter', (value) => {
        const oldVal = JSON.stringify(fromDataSourceFilterToFilterValues(dataSource.filter))
        console.log(value , '===', oldVal)
        if (value === oldVal) {
            return ;
        }

        let result = jsonParse(value!)
        result = filterEmpty(result)
        dataSource.setFilters(fromFilterValuesToDSFilters(dataSource, result))
    });
    const sortStr = trySet('sort', (value) => {
        let result = jsonParse(value!)
        if (! isArray(value)) {
            return null;
        }

        dataSource.setSort(result)
    });

    const numberSetter = (key: PageKey) => {
        return (value: string | null) => {
            const val = normalizeNumber(value)
            if (! isEmptyValue(val)) {
                dataSource[key] = val!
            }
        }
    }
    const page = trySet('page', numberSetter('page'));
    const pageSize = trySet('pageSize', numberSetter('pageSize'));
    const cursor = trySet('cursor', numberSetter('cursor'));

    useEffect(() => {
        return observe(dataSource, 'filter', (change) => {
            const val = fromDataSourceFilterToFilterValues(change.newValue);
            console.log('Change:', val)
            querySetOrDel(query, 'filter', val)
            setURLSearchParams(query)
        })
    }, [dataSource, query])
    useEffect(() => {
        return observe(dataSource, 'sort', (change) => {
            const val = change.newValue;
            console.log('Change:', toJS(change.newValue))
            querySetOrDel(query, 'sort', val)
            setURLSearchParams(query)
        })
    }, [dataSource, query])

    useEffect(() => {
        const paginator = dataSource.paginator
        if (! paginator) {
            return ;
        }
        return observe(paginator, (change) => {
            if (change.type !== "update") {
                return ;
            }
            const name = change.name as string
            const val = change.newValue
            if (!['page', 'pageSize','cursor'].includes(name)) {
                return ;
            }

            console.log('Change:', name, val)
            querySetOrDel(query, name, val)
            setURLSearchParams(query)
        })
    }, [dataSource.paginator, query])

    useEffect(() => {
        dataSource.fetch()
    }, [filterStr, sortStr, page, pageSize, cursor])
}

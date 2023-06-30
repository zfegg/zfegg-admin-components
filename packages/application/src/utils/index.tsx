import mergeWith from 'lodash/mergeWith';
import type {History} from 'history';

export function gotoLogin(_: History) {
    window.location.href = '/zfegg/admin-center-auth/login?redirect_uri=' + window.location.href;
}

export function configMerge(objValue: any, srcValue: any): any | undefined {
    if (Array.isArray(objValue)) {
        return objValue.concat(srcValue);
    }

    if (objValue instanceof Map && srcValue instanceof Map) {
        srcValue.forEach((value, key) => {
            if (objValue.has(key)) {
                const val = mergeWith({x: objValue.get(key)}, {x: value}, configMerge).x;
                objValue.set(key, val);
            } else {
                objValue.set(key, value);
            }
        });
        return objValue;
    }

    // 替换 React 组件
    if (typeof srcValue === "object" && srcValue.$$typeof) {
        return srcValue
    }
}

let baseAttachmentUrl: string = "";
export function setBaseAttachmentUrl(url: string) {
    baseAttachmentUrl = url
}

export function attachmentUrl(src: string) {
    return /^https?:\/\//.test(src) ? src : (baseAttachmentUrl + src)
}
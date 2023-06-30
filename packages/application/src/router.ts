import {useContext, useMemo} from "react";
import {RouteConfig} from "./interfaces";
import {
    renderMatches,
    RouteObject,
    UNSAFE_NavigationContext,
    UNSAFE_RouteContext as RouteContext,
    useLocation
} from "react-router";
import {compile, match} from "path-to-regexp";
import {History} from "history";

// function useDataRouterState(hookName: string) {
//     let state = useContext(DataRouterStateContext);
//     return state;
// }

// export function useMatches() {
//     let { matches, loaderData } = useDataRouterState(
//         DataRouterStateHook.UseMatches
//     );
//     return useMemo(
//         () =>
//             matches.map((match) => {
//                 let { pathname, params } = match;
//                 // Note: This structure matches that created by createUseMatchesMatch
//                 // in the @remix-run/router , so if you change this please also change
//                 // that :)  Eventually we'll DRY this up
//                 return {
//                     id: match.route.id,
//                     pathname,
//                     params,
//                     data: loaderData[match.route.id] as unknown,
//                     handle: match.route.handle as unknown,
//                 };
//             }),
//         [matches, loaderData]
//     );
// }

export function useMatches() {
    const {matches} = useContext(RouteContext)
    return matches
}

export function useMatchedRoute(): RouteConfig {
    const matches = useMatches()
    return useMemo(() => {
        const route = matches.slice(0).pop()
        return route?.route as RouteConfig;
    }, [matches])
}

type RouteMatch = Exclude<Parameters<typeof renderMatches>[0], null>[0]
const joinPaths = (paths: string[]): string => paths.join("/").replace(/\/\/+/g, "/");

interface FlattenResult extends RouteConfig {
    relPath: string
    parents: RouteConfig[]
}

function flattenRoutes(
    routes: RouteObject[],
    parents: RouteObject[] = [],
    parentPath: string = ''
): FlattenResult[] {
    return routes.flatMap((route, index) => {
        let relPath = route.path;
        if (! route.path?.startsWith("/")) {
            relPath = joinPaths([parentPath || "", route.path || ""]);
        }

        const children = flattenRoutes(route.children || [], [...parents, route], relPath);
        if (!children.length) {
            return {
                ...route,
                parents,
                relPath: relPath!
            }
        }

        return children
    });
}

export function matchRoutes(
    routes: RouteObject[],
    pathname: string,
): RouteMatch[] | null {

    const branches = flattenRoutes(routes);
    for (let i = 0; i < branches.length; ++i) {
        const {relPath, parents, ...route} = branches[i];
        const fn = match(relPath!, {decode: decodeURIComponent,})(pathname);

        if (fn) {
            return parents.concat(route).map((route) => {
                return {
                    params: fn.params as Record<string, any>,
                    pathname,
                    pathnameBase: relPath,
                    route,
                }
            });
        }
    }

    return null;
}

export function useRoutes(routes: RouteObject[]) {
    const location = useLocation();

    // console.log(location.pathname)
    const matches = matchRoutes(routes, location.pathname)
    return renderMatches(matches)
}

export function generatePath(pattern: string, params?: Record<string, any>): string {
    return compile(pattern)(params)
}

export function useHistory(): History {
    return useContext(UNSAFE_NavigationContext).navigator as History
}
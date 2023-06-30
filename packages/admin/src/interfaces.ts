import {RouteConfig as AppRouteConfig, User} from "@zfegg/admin-application";
import {Status} from "./constants";
import {PROVIDERS} from "./constants";

export interface IUser extends User {
    id: number;
    email?: string;
    password?: string;
    created_at: string;
    updated_at: string;
    status: Status;
    roles: IRole[],
    bindings: Binding[]
}

export interface IRole {
    id: number,
    name: string,
    description?: string,
    users: IUser[],
    menus: string[]
}

// export interface Permission {
//     name: string,
//     permissions: string[],
// }

export interface AuthUser extends User {
    menus: string[]
}

export interface RouteConfig extends AppRouteConfig {
    authorization: boolean
}

export interface UserProfile extends User {
    email: string;
    bindings: Binding[];
}

export interface Binding {
    id: number;
    provider: keyof typeof PROVIDERS;
    info: { username?: string };
    created_at: string;
}

export interface IConfigProvider {
    assignRoleDisabled?: boolean
}
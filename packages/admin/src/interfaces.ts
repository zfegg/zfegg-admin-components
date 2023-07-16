import {Status} from "./constants";
import {User} from "@zfegg/admin-layout";

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

export interface UserProfile extends User {
    email: string;
    bindings: Binding[];
}

export interface Binding {
    id: number;
    provider: string;
    info: { username?: string };
    created_at: string;
}

export interface IConfigProvider {
    assignRoleDisabled?: boolean
}

export interface Member {
    id: number,
    user: User,
    role: IRole
    expired: string | null
}
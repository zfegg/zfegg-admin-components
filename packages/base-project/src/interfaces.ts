import {IRole, IUser as AdminUser} from "@zfegg/admin-admin";

export interface User extends AdminUser {
    projects: Project[]
}

export interface Group {
    id: number
    name: string
    members: User[]
}

export interface Project {
    id: number,
    name: string,
    avatar: string | null,
    code: string,
    secret: string
}

export interface Member {
    id: number,
    member: User,
    role: IRole
    expired: string | null
}

export type ProjectParam = {
    project: string
}

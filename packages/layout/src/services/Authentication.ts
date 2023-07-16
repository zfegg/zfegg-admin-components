import {AxiosInstance} from 'axios';
import {AuthenticationInterface, User} from '../interfaces';

export default class Authentication<U extends User = User> implements AuthenticationInterface<U> {
    private _user: U | undefined | null;

    public get user(): U | undefined | null {
        return this._user;
    }

    constructor(private http: AxiosInstance) {}

    public async fetchUser(): Promise<U> {
        if (!this.user) {
            const response = await this.http.get<U>('/user');
            this._user = response.data;
        }

        return this.user!;
    }

    destroy = async () => {
        await this.http.get('/auth/logout');
        this._user = null
    }

    hasPermission(name: string): boolean {
        const user = this.user!

        if (user.admin) {
            return true;
        }

        return user.menus.some((menu) => `${menu}/`.indexOf(`${name}/`) !== -1)
    }
}

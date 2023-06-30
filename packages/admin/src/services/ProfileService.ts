import {AxiosInstance} from "axios";
import {UserProfile} from "../interfaces";

export default class ProfileService {
    constructor(
        private http: AxiosInstance
    ) {
    }

    async changePassword(data: Record<string, string>) {
        await this.http.post('/user/change-password', data)
    }

    async fetchUserProfile(): Promise<UserProfile> {
        const response = await this.http.get<UserProfile>('/user/profile');
        return response.data;
    }

    async update(data: Partial<UserProfile>): Promise<UserProfile> {
        const response = await this.http.post<UserProfile>('/user/profile', data);
        return response.data;
    }
}
import {AxiosInstance} from "axios";
import {Project} from "../interfaces";

export default class ProjectService {

    constructor(private http: AxiosInstance) {
    }

    private projectsPromise?: Promise<Project[]>

    async fetchProjects(): Promise<Project[]> {
        if (! this.projectsPromise) {
            this.projectsPromise = this.http.get<Project[]>('/my-projects')
                .then(response => response.data)
                .catch(e => {
                    this.projectsPromise = undefined
                    return Promise.reject(e);
                });
        }

        return this.projectsPromise
    }

    async projectMenus(projectId: number): Promise<string[]> {
        const response = await this.http.get<string[]>(`my-projects/${projectId}/menus`)
        return response.data
    }
}


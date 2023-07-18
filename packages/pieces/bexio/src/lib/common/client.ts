import { AuthenticationType, HttpMessageBody, HttpMethod, QueryParams, httpClient } from "@activepieces/pieces-common"
import { ListParams } from "./models/common"
import { User } from "./models/user"
import { ClientService } from "./models/client_service"
import { CreateTimesheetRequest, Timesheet } from "./models/timesheet"

function prepareQueryParams(obj: any): Record<string, string> {
    const params: Record<string, string> = {}
    for(const k of Object.keys(obj)) {
        params[k] = obj[k].toString()
    }
    return params
}

export class BexioClient {

    constructor(private accessToken: string, private baseUrl = 'https://api.bexio.com') {}

    async makeRequest<T extends HttpMessageBody>(method: HttpMethod, url: string, query?: QueryParams, body?: object): Promise<T> {
        const res = await httpClient.sendRequest<T>({
            method,
            url: this.baseUrl + url,
            queryParams: query,
            body,
            authentication: {
                type: AuthenticationType.BEARER_TOKEN,
                token: this.accessToken
            }
        })
        return res.body
    }

    async listUsers(params?: ListParams): Promise<User[]> {
        return await this.makeRequest(HttpMethod.GET, '/3.0/users', prepareQueryParams(params))
    }

    async listClientServices(params?: ListParams): Promise<ClientService[]> {
        return await this.makeRequest(HttpMethod.GET, '/2.0/client_service', prepareQueryParams(params))
    }

    async createTimesheet(request: CreateTimesheetRequest): Promise<Timesheet> {
        return await this.makeRequest(HttpMethod.POST, '/2.0/timesheet', undefined, request)
    }

}
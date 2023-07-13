import { AuthenticationType, HttpMessageBody, HttpMethod, httpClient } from "@activepieces/pieces-common"

export interface PollRequest {
    options: string[],
    expires_in: number,
    multiple: boolean,
    hide_totals: boolean
}

export enum Visibility {
    PUBLIC = 'public',
    UNLISTED = 'unlisted',
    PRIVATE = 'private',
    DIRECT = 'direct'
}

export interface PostStatusRequest {
    status?: string,
    media_ids?: string[],
    poll?: PollRequest,
    in_reply_to_id?: string,
    sensitive?: boolean,
    spoiler_text?: string,
    visibility?: Visibility,
    language?: string
}

export interface UploadMediaRequest {
    content: Buffer
    contentType: string,
    thumbnail?: Buffer,
    thumbnailType?: string,
    description?: string,
    focus?: string
}

export interface Status {
    id: string,
    created_at: string,
    content: string
}

export interface Media {
    id: string,
    type: string,
    url: string,
    description?: string
}

export class MastodonClient {
    constructor(private baseUrl: string, private accessToken: string) {}
    async makeRequest<T extends HttpMessageBody>(method: HttpMethod, path: string, body?: any): Promise<T> {
        const res = await httpClient.sendRequest<T>({
            url: this.baseUrl + '/api' + path,
            method,
            authentication: {
                type: AuthenticationType.BEARER_TOKEN,
                token: this.accessToken,
            },
            body
        })
        return res.body
    }
    async uploadMedia(request: UploadMediaRequest): Promise<Media> {
        const form = new FormData()
        form.append('file', new Blob([request.content.buffer], {
            type: request.contentType
        }))
        if(request.thumbnail && request.thumbnailType) {
            form.append('thumbnail', new Blob([request.thumbnail.buffer], {
                type: request.thumbnailType
            }))
        }
        if(request.description) {
            form.append('description', request.description)
        }
        if(request.focus) {
            form.append('focus', request.focus)
        }
        const media = await this.makeRequest<Media>(HttpMethod.POST, '/v2/media', form)
        return media
    }
    async postStatus(request: PostStatusRequest): Promise<Status> {
        const status = await this.makeRequest<Status>(HttpMethod.POST, '/v1/statuses', request)
        return status
    }
}
import { CustomAuthPropertyValue, CustomAuthProps } from "@activepieces/pieces-framework";
import { MastodonClient } from "./client";

const MIME_MAPPING: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpg'
}

export function extensionToMime(extension: string): string | null {
    extension = extension.toLowerCase()
    if(!(extension in MIME_MAPPING))
        return null
    return MIME_MAPPING[extension]
}

export function makeClient(auth: CustomAuthPropertyValue<CustomAuthProps>): MastodonClient {
    return new MastodonClient(auth.base_url as string, auth.access_token as string)
}
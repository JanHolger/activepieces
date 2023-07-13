import { Property, createAction } from "@activepieces/pieces-framework";
import { mastodonAuth } from "../..";
import { extensionToMime, makeClient } from "../common";

export const postStatus = createAction({
    auth: mastodonAuth,
        name: 'post_status',
        displayName: 'Post Status',
        description: 'Post a status to Mastodon',
        sampleData: {},
        props: {
            status: Property.LongText({
                displayName: 'Status',
                description: 'The text of your status',
                required: true,
            }),
            media: Property.File({
                displayName: 'Media',
                description: 'Attaches media to the post',
                required: false
            })
        },
        async run(context) {
            const client = makeClient(context.auth)
            const statusText = context.propsValue.status;
            const media = context.propsValue.media
            let mediaIds = undefined
            if(media) {
                const mimeType = extensionToMime(media.extension ?? '')
                if(mimeType == null)
                    throw 'Unsupported media type'
                const uploadedMedia = await client.uploadMedia({
                    content: Buffer.from(media.base64, 'base64'),
                    contentType: mimeType
                })
                mediaIds = [ uploadedMedia.id ]
            }
            const status = await client.postStatus({
                status: statusText,
                media_ids: mediaIds
            })
            return status
        }
})

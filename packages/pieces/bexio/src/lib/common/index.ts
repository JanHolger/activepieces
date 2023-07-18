import { OAuth2PropertyValue, PieceAuth, Property } from "@activepieces/pieces-framework"
import { getAccessTokenOrThrow } from '@activepieces/pieces-common'
import { isNil } from "@activepieces/shared";
import { BexioClient } from "./client";

export function makeClient(auth: OAuth2PropertyValue): BexioClient {
    const accessToken = getAccessTokenOrThrow(auth)
    const client = new BexioClient(accessToken);
    return client
}

export const bexioCommon = {
    auth: PieceAuth.OAuth2({
        displayName: 'Authentication',
        required: true,
        authUrl: 'https://idp.bexio.com/authorize',
        tokenUrl: 'https://idp.bexio.com/token',
        scope: [
            'openid',
            'offline_access',
            'project_edit',
            'monitoring_edit'
        ]
    }),
    user_id: (required = true) => Property.Dropdown({
        displayName: 'User',
        required,
        refreshers: [],
        options: async ({ auth }) => {
            if (isNil(auth)) {
                return {
                    disabled: true,
                    placeholder: 'setup authentication first',
                    options: []
                };
            }
            const client = makeClient(auth as OAuth2PropertyValue)
            const users = await client.listUsers({ limit: 2000 })
            return {
                disabled: false,
                options: users.map((user) => {
                    return {
                        label: user.firstname + ' ' + user.lastname,
                        value: user.id
                    }
                })
            }
        }
    }),
    client_service_id: (required = true) => Property.Dropdown({
        displayName: 'Business Activity',
        required,
        refreshers: [],
        options: async ({ auth }) => {
            if (isNil(auth)) {
                return {
                    disabled: true,
                    placeholder: 'setup authentication first',
                    options: []
                };
            }
            const client = makeClient(auth as OAuth2PropertyValue)
            const users = await client.listClientServices({ limit: 2000 })
            return {
                disabled: false,
                options: users.map((service) => {
                    return {
                        label: service.name,
                        value: service.id
                    }
                })
            }
        }
    })
}
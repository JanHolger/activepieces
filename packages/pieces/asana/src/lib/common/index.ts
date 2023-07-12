import { Property, OAuth2PropertyValue } from "@activepieces/pieces-framework";
import { getAccessTokenOrThrow } from "@activepieces/pieces-common";

import asana, { Client } from 'asana'

export const asanaCommon = {
    workspace: Property.Dropdown({
        displayName: 'Workspace',
        required: true,
        refreshers: [],
        options: async ({ auth }) => {
            if (!auth) {
                return {
                    disabled: true,
                    placeholder: 'connect your account first',
                    options: [],
                };
            }
            const client = makeClient(auth as OAuth2PropertyValue)
            const workspaces = await fetchAllPages(await client.workspaces.findAll())
            return {
                disabled: false,
                options: workspaces.map((workspace) => {
                    return {
                        label: workspace.name,
                        value: workspace.gid
                    }
                }),
            };
        }
    }),
    project: Property.Dropdown({
        displayName: 'Project',
        required: true,
        refreshers: ['workspace'],
        options: async ({ auth, workspace }) => {
            if (!auth) {
                return {
                    disabled: true,
                    placeholder: 'connect your account first',
                    options: [],
                };
            }
            if (!workspace) {
                return {
                    disabled: true,
                    placeholder: 'Select workspace first',
                    options: [],
                };
            }
            const client = makeClient(auth as OAuth2PropertyValue)
            const projects = await fetchAllPages(await client.projects.findByWorkspace(workspace as string))
            return {
                disabled: false,
                options: projects.map((project) => {
                    return {
                        label: project.name,
                        value: project.gid
                    }
                }),
            };
        }
    }),
    assignee: Property.Dropdown<string>({
        displayName: 'Assignee',
        required: false,
        refreshers: ['workspace'],
        options: async ({ auth, workspace }) => {
            if (!auth) {
                return {
                    disabled: true,
                    placeholder: 'connect your account first',
                    options: [],
                };
            }
            if (!workspace) {
                return {
                    disabled: true,
                    placeholder: 'Select workspace first',
                    options: [],
                };
            }
            const client = makeClient(auth as OAuth2PropertyValue)
            const users = await fetchAllPages(await client.users.findByWorkspace(workspace as string))
            return {
                disabled: false,
                options: users.map((user) => {
                    return {
                        label: user.name,
                        value: user.gid
                    }
                }),
            };
        },
    }),
    tags: Property.MultiSelectDropdown<string>({
        displayName: 'Tags',
        required: false,
        refreshers: ['workspace'],
        options: async ({ auth, workspace }) => {
            if (!auth) {
                return {
                    disabled: true,
                    placeholder: 'connect your account first',
                    options: [],
                };
            }
            if (!workspace) {
                return {
                    disabled: true,
                    placeholder: 'Select workspace first',
                    options: [],
                };
            }
            const client = makeClient(auth as OAuth2PropertyValue)
            const tags = await fetchAllPages(await client.tags.findByWorkspace(workspace as string))
            return {
                disabled: false,
                options: tags.map(tag => {
                    return {
                        label: tag.name,
                        value: tag.gid
                    }
                }),
            };
        },
    }),
}

export function makeClient(auth: OAuth2PropertyValue): Client {
    const accessToken = getAccessTokenOrThrow(auth as OAuth2PropertyValue)
    return Client.create().useAccessToken(accessToken)
}

export async function resolveTagsByNamesOrIds(client: asana.Client, workspace: string, names: string[]): Promise<string[]> {
    const allTags = await fetchAllPages(await client.tags.findByWorkspace(workspace))
    const tagsGids = names.map(inputTag => {
        const foundTagById = allTags.find(tag => tag.gid === inputTag)
        if (foundTagById) {
            return foundTagById.gid
        }
        const foundTag = allTags.find(tag => tag.name?.toLowerCase() === inputTag.toLowerCase())
        if (foundTag) {
            return foundTag.gid
        }
        return null
    }).filter(tag => tag !== null) as string[]
    return tagsGids
}

export async function fetchAllPages<T extends asana.resources.AnonymousResource>(page: asana.resources.ResourceList<T>): Promise<T[]> {
    const resources: T[] = []
    let currentPage: asana.resources.ResourceList<T> | null = page
    do {
        resources.push(...currentPage.data)
        currentPage = await currentPage.nextPage()
    } while(currentPage != null)
    return resources
}

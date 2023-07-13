import { Property, OAuth2PropertyValue, PieceAuth } from "@activepieces/pieces-framework";
import { getAccessTokenOrThrow } from "@activepieces/pieces-common";

import asana, { Client } from 'asana'

asana.resources.Events

export const asanaCommon = {
    auth: PieceAuth.OAuth2({
        displayName: 'Authentication',
        description: "",
        authUrl: "https://app.asana.com/-/oauth_authorize",
        tokenUrl: "https://app.asana.com/-/oauth_token",
        required: true,
        scope: ['default'],
    }),
    workspace: (required = true) => Property.Dropdown({
        displayName: 'Workspace',
        required,
        refreshers: [],
        options: async ({ auth }) => {
            if (!auth) {
                return {
                    disabled: true,
                    placeholder: 'connect your account first',
                    options: []
                }
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
                })
            }
        }
    }),
    project: (required = true) => Property.Dropdown({
        displayName: 'Project',
        required,
        refreshers: ['workspace'],
        options: async ({ auth, workspace }) => {
            if (!auth) {
                return {
                    disabled: true,
                    placeholder: 'connect your account first',
                    options: []
                }
            }
            if (!workspace) {
                return {
                    disabled: true,
                    placeholder: 'Select workspace first',
                    options: []
                }
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
                })
            }
        }
    }),
    assignee: (required = true) => Property.Dropdown<string>({
        displayName: 'Assignee',
        required,
        refreshers: ['workspace'],
        options: async ({ auth, workspace }) => {
            if (!auth) {
                return {
                    disabled: true,
                    placeholder: 'connect your account first',
                    options: []
                }
            }
            if (!workspace) {
                return {
                    disabled: true,
                    placeholder: 'Select workspace first',
                    options: []
                }
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
                })
            }
        }
    }),
    tags: (required = true) => Property.MultiSelectDropdown<string>({
        displayName: 'Tags',
        required,
        refreshers: ['workspace'],
        options: async ({ auth, workspace }) => {
            if (!auth) {
                return {
                    disabled: true,
                    placeholder: 'connect your account first',
                    options: []
                }
            }
            if (!workspace) {
                return {
                    disabled: true,
                    placeholder: 'Select workspace first',
                    options: []
                }
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
                })
            }
        }
    }),
    task: (required = true) => Property.Dropdown<string>({
        displayName: 'Task',
        required,
        refreshers: ['workspace', 'project'],
        options: async ({ auth, workspace, project }) => {
            if (!auth) {
                return {
                    disabled: true,
                    placeholder: 'connect your account first',
                    options: []
                }
            }
            if (!workspace) {
                return {
                    disabled: true,
                    placeholder: 'Select workspace first',
                    options: []
                }
            }
            if (!project) {
                return {
                    disabled: true,
                    placeholder: 'Select project first',
                    options: []
                }
            }
            const client = makeClient(auth as OAuth2PropertyValue)
            const tasks = await fetchAllPages(await client.tasks.findByProject(project as string))
            return {
                disabled: false,
                options: tasks.map(task => {
                    return {
                        label: task.name,
                        value: task.gid
                    }
                })
            }
        },
    })
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
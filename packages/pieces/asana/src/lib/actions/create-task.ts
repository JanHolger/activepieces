import { asanaCommon, makeClient, resolveTagsByNamesOrIds } from "../common";
import dayjs from "dayjs";
import { asanaAuth } from "../../"
import { OAuth2PropertyValue, Property, createAction } from "@activepieces/pieces-framework";

export const asanaCreateTaskAction = createAction({
    auth: asanaAuth,
    name: 'create_task',
    description: 'Create a new task',
    displayName: 'Create Task',
    props: {
        workspace: asanaCommon.workspace,
        project: asanaCommon.project,
        name: Property.ShortText({
            description: 'The name of the task to create',
            displayName: 'Task Name',
            required: true,
        }),
        notes: Property.LongText({
            description: 'Free-form textual information associated with the task (i.e. its description).',
            displayName: 'Task Description',
            required: true,
        }),
        due_on: Property.ShortText({
            description: 'The date on which this task is due in any format.',
            displayName: 'Due Date',
            required: false,
        }),
        tags: asanaCommon.tags,
        assignee: asanaCommon.assignee,
    },
    sampleData: {
        gid: "1203851701808347",
        resource_type: "task",
        created_at: "2023-01-29T17:42:13.598Z",
        modified_at: "2023-01-29T17:42:13.759Z",
        name: "First Task",
        notes: "Heloo Hello",
        assignee: null,
        completed: false,
        assignee_status: "upcoming",
        completed_at: null,
        due_on: null,
        due_at: null,
        resource_subtype: "default_task",
        tags: [],
        projects: [
            {
                gid: "1203851606424941",
                resource_type: "project",
                name: "Cross-functional project plan"
            }
        ],
        workspace: {
            gid: "1202550105911307",
            resource_type: "workspace",
            name: "activepieces.com"
        }
    },
    async run(configValue) {
        const { auth } = configValue
        const client = makeClient(auth as OAuth2PropertyValue)
        const { project, name, notes, tags, workspace, due_on, assignee } = configValue.propsValue

        const convertDueOne = due_on ? dayjs(due_on).toISOString() : undefined

        // User can provide tags name as dynamic value, we need to convert them to tags gids
        const tagsGids = await resolveTagsByNamesOrIds(client, workspace, tags ?? [])

        const task = await client.tasks.createInWorkspace(workspace, {
            name,
            projects: [project],
            notes,
            assignee,
            due_on: convertDueOne,
            tags: tagsGids
        })

        return task
    }
})

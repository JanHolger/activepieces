import { asanaCommon, makeClient, resolveTagsByNamesOrIds } from "../common";
import dayjs from "dayjs";
import { OAuth2PropertyValue, Property, createAction } from "@activepieces/pieces-framework";

export default createAction({
    auth: asanaCommon.auth,
    name: 'create_task',
    description: 'Create a new task',
    displayName: 'Create Task',
    props: {
        workspace: asanaCommon.workspace(true),
        project: asanaCommon.project(true),
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
        tags: asanaCommon.tags(false),
        assignee: asanaCommon.assignee(false),
    },
    async run(configValue) {
        const { auth } = configValue
        const client = makeClient(auth as OAuth2PropertyValue)
        const { project, name, notes, tags, workspace, due_on, assignee } = configValue.propsValue

        const convertDueOne = due_on ? dayjs(due_on).toISOString() : undefined

        // User can provide tags name as dynamic value, we need to convert them to tags gids
        const tagsGids = await resolveTagsByNamesOrIds(client, workspace as string , tags ?? [])

        const task = await client.tasks.createInWorkspace(workspace as string, {
            name,
            projects: [ project as string ],
            notes,
            assignee,
            due_on: convertDueOne,
            tags: tagsGids
        })

        return task
    }
})

import { asanaCommon, makeClient, resolveTagsByNamesOrIds } from "../common";
import dayjs from "dayjs";
import { OAuth2PropertyValue, Property, createAction } from "@activepieces/pieces-framework";
import { sampleTask } from "../common/samples";

export default createAction({
    auth: asanaCommon.auth,
    name: 'update_task',
    description: 'Updates an existing task',
    displayName: 'Update Task',
    props: {
        workspace: asanaCommon.workspace(),
        project: asanaCommon.project(),
        task: asanaCommon.task(),
        name: Property.ShortText({
            description: 'New name of the task',
            displayName: 'Task Name',
            required: false,
        }),
        notes: Property.LongText({
            description: 'Free-form textual information associated with the task (i.e. its description).',
            displayName: 'Task Description',
            required: false,
        }),
        due_on: Property.ShortText({
            description: 'The date on which this task is due in any format.',
            displayName: 'Due Date',
            required: false,
        }),
        assignee: asanaCommon.assignee(false),
        custom_fields: Property.Object({
            displayName: 'Custom Fields',
            required: false,
        })
    },
    async run(configValue) {
        const { auth } = configValue
        const client = makeClient(auth as OAuth2PropertyValue)
        const { task, name, notes, due_on, assignee, custom_fields } = configValue.propsValue

        const convertDueOne = due_on ? dayjs(due_on).toISOString() : undefined

        const updatedTask = await client.tasks.update(task as string, {
            name,
            notes,
            assignee,
            due_on: convertDueOne,
            custom_fields: custom_fields as Record<string, string>
        })

        return updatedTask
    }
})


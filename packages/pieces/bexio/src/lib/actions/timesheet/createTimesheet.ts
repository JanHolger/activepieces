import { Property, createAction } from "@activepieces/pieces-framework";
import { bexioCommon, makeClient } from "../../common";
import dayjs from 'dayjs'

export default createAction({
    auth: bexioCommon.auth,
    name: 'create_timesheet',
    displayName: 'Create Timesheet',
    description: 'Creates a new timesheet',
    props: {
        user_id: bexioCommon.user_id(),
        client_service_id: bexioCommon.client_service_id(),
        start_date: Property.DateTime({
            displayName: 'Start Date',
            required: true
        }),
        end_date: Property.DateTime({
            displayName: 'End Date',
            required: true
        }),
        project_id: bexioCommon.project_id(false),
        text: Property.LongText({
            displayName: 'Text',
            required: false
        }),
        billable: Property.Checkbox({
            displayName: 'Billable',
            required: false
        })
    },
    async run(context) {
        const client = makeClient(context.auth)
        const propsValue = context.propsValue
        const timesheet = await client.createTimesheet({
            user_id: propsValue.user_id as number,
            client_service_id: propsValue.client_service_id as number,
            allowable_bill: propsValue.billable ?? false,
            text: propsValue.text,
            pr_project_id: propsValue.project_id,
            tracking: {
                type: 'range',
                start: dayjs(propsValue.start_date).toISOString(),
                end: dayjs(propsValue.end_date).toISOString()
            }
        })
        return timesheet
    }
})
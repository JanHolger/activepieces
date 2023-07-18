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
        })
    },
    async run(context) {
        const client = makeClient(context.auth)
        const { user_id, client_service_id, start_date, end_date } = context.propsValue
        const timesheet = await client.createTimesheet({
            user_id: user_id as number,
            client_service_id: client_service_id as number,
            allowable_bill: false,
            tracking: {
                type: 'range',
                date: dayjs(start_date).toISOString(),
                end_date: dayjs(end_date).toISOString()
            }
        })
        return timesheet
    }
})
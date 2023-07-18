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
        //client_service_id: bexioCommon.client_service_id(),
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
        const { user_id, start_date, end_date } = context.propsValue
    }
})
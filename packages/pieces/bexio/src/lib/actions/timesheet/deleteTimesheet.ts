import { Property, createAction } from "@activepieces/pieces-framework";
import { bexioCommon, makeClient } from "../../common";

export default createAction({
    auth: bexioCommon.auth,
    name: 'delete_timesheet',
    displayName: 'Delete Timesheet',
    description: 'Deletes a timesheet',
    props: {
        timesheet_id: Property.Number({
            displayName: 'Timesheet ID',
            required: true
        })
    },
    async run(context) {
        const client = makeClient(context.auth)
        await client.deleteTimesheet(context.propsValue.timesheet_id)
    }
})
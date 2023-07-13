import { OAuth2PropertyValue, StoreScope, TriggerStrategy, createTrigger } from "@activepieces/pieces-framework";
import { sampleShortUser, sampleTask } from "../common/samples";
import { asanaCommon, makeClient } from "../common";
import asana from "asana";

export default createTrigger({
    auth: asanaCommon.auth,
    name: 'new_task',
    displayName: 'New Task',
	description: 'Triggers when a new task is created',
    type: TriggerStrategy.WEBHOOK,
    props: {
        workspace: asanaCommon.workspace(true)
    },
	async onEnable(ctx) {
        const client = makeClient(ctx.auth as OAuth2PropertyValue)
        const webhook = await client.webhooks.create(ctx.propsValue.workspace as string, ctx.webhookUrl, {
            filters: [
                {
                    action: 'added',
                    resource_type: 'task'
                }
            ]
        })
        await ctx.store.put('trigger_webhook_id', webhook.gid, StoreScope.FLOW)
    },
    sampleData: {
        user: sampleShortUser,
        task: sampleTask
    },
	async onDisable(ctx) {
        const webhookId: string|null = await ctx.store.get('trigger_webhook_id', StoreScope.FLOW)
        if(webhookId !== null) {
            const client = makeClient(ctx.auth as OAuth2PropertyValue)
            await client.webhooks.deleteById(webhookId)
            await ctx.store.delete('trigger_webhook_id', StoreScope.FLOW)
        }
    },
    async run(ctx): Promise<unknown[]> {
        if(!ctx.payload.body)
            return []
        const events = ctx.payload.body.events as asana.resources.Events.EventDataEntity[]
        return events.map(event => ({
            user: event.user,
            task: event.resource
        }))
    }
})
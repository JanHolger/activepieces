import { OAuth2PropertyValue, StoreScope, TriggerStrategy, WebhookHandshakeStrategy, createTrigger } from "@activepieces/pieces-framework";
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
        workspace: asanaCommon.workspace(true),
        project: asanaCommon.project(true)
    },
	async onEnable(ctx) {
        const client = makeClient(ctx.auth as OAuth2PropertyValue)
        try {
            const webhook = await client.webhooks.create(ctx.propsValue.project as string, ctx.webhookUrl, {
                filters: [
                    {
                        action: 'added',
                        resource_type: 'task',
                        resource_subtype: 'default_task'
                    }
                ]
            })
            await ctx.store.put('trigger_webhook_id', webhook.gid, StoreScope.FLOW)
        } catch (err: any) {
            console.log(err.value.errors)
        }
    },
    handshakeConfiguration: {
        strategy: WebhookHandshakeStrategy.HEADER_PRESENT,
        paramName: 'x-hook-secret'
    },
    async onHandshake(ctx) {
        
        console.error('-----------------------------------------')
        console.error(ctx.payload)
        console.error('-----------------------------------------')
        return {
            status: 204,
            headers: {
                'x-hook-secret': ctx.payload.headers['x-hook-secret']
            }
        }
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
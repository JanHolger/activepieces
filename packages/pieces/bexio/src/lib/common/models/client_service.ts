export interface ClientService {
    id: number,
    name: string,
    default_is_billable?: boolean
    default_price_per_hour?: number,
    account_id?: number
}
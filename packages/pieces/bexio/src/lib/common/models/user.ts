import { SalutationType } from "./common";

export interface User {
    id: number,
    salutation_type?: SalutationType,
    firstname?: string,
    lastname?: string,
    email: string,
    is_superadmin?: boolean,
    is_accountant?: boolean
}
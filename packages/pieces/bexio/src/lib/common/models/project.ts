export enum ProjectInvoiceType {
    HOURLY_RATE_SERVICE = 1,
    HOURLY_RATE_EMPLOYEE = 2,
    HOURLY_RATE_PROJECT = 3,
    FIX = 4
}

export enum ProjectBudgetType {
    BUDGETED_COSTS = 1,
    BUDGETED_HOURS = 2,
    SERVICE_BUDGET = 3,
    SERVICE_EMPLOYEES = 4
}

export interface Project {
    id: number,
    uuid: string,
    nr?: string,
    name: string,
    start_date?: string,
    end_date?: string,
    comment?: string,
    pr_state_id: number,
    pr_project_type_id: number,
    contact_id: number,
    contact_sub_id?: number,
    pr_invoice_type_id?: ProjectInvoiceType,
    pr_invoice_type_amount?: string,
    pr_budget_type_id?: ProjectBudgetType,
    pr_budget_type_amount?: string
}

export interface CreateProjectRequest {
    name: string,
    start_date?: string,
    end_date?: string,
    comment?: string,
    pr_state_id: number,
    pr_project_type_id: number,
    contact_id: number,
    contact_sub_id?: number,
    pr_invoice_type_id?: ProjectInvoiceType,
    pr_invoice_type_amount?: string,
    pr_budget_type_id?: ProjectBudgetType,
    pr_budget_type_amount?: string,
    user_id: number
}
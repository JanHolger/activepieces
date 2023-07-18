export interface Timesheet {
    id: number,
    user_id: number,
    status_id: number,
    client_service_id: number,
    text?: string,
    allowable_bill: boolean,
    charge?: string,
    contact_id?: number,
    sub_contact_id?: number,
    pr_project_id?: number,
    pr_package_id?: number,
    pr_milestone_id?: number,
    travel_time?: string,
    travel_charge?: string,
    travel_distance?: number,
    estimated_time?: string,
    date: string,
    duration?: string,
    running?: boolean,
    tracking: TimesheetTracking
}

export type TimesheetTracking = TimesheetTrackingDuration | TimesheetTrackingRange

export interface TimesheetTrackingDuration {
    type: 'duration',
    date: string,
    duration: string
}

export interface TimesheetTrackingRange {
    type: 'range',
    start: string,
    end: string
}

export interface CreateTimesheetRequest {
    user_id: number,
    status_id?: number,
    client_service_id: number,
    text?: string,
    allowable_bill: boolean,
    charge?: string,
    contact_id?: number,
    sub_contact_id?: number,
    pr_project_id?: number,
    pr_package_id?: number,
    pr_milestone_id?: number,
    estimated_time?: string,
    tracking: TimesheetTracking
}
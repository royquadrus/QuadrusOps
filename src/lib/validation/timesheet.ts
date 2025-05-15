import { z } from "zod";

export const timesheetSchema = z.object({
    timesheet_id: z.number().optional(),
    employee_id: z.number(),
    pay_period_id: z.string(),
    status: z.string(),
    approver_id: z.number().optional(),
    approver_name: z.string().optional(),
    approved_on: z.string().optional(),
    note: z.string().optional(),
});

export const timesheetEntrySchema = z.object({
    timesheet_entry_id: z.number().optional(),
    timesheet_id: z.number(),
    project_id: z.number().optional(),
    timesheet_task_id: z.number().optional(),
    entry_date: z.string(),
    time_in: z.string(),
    time_out: z.string().optional(),
    duration: z.number().optional(),
    minutes_paid: z.number().optional(),
    minutes_banked: z.number().optional(),
});

export const timesheetTaskSchema = z.object({
    timesheet_task_id: z.number().optional(),
    task_name: z.string(),
    description: z.string().optional(),
});

export type TimesheetEntry = z.infer<typeof timesheetEntrySchema>;
export type TimesheetTask = z.infer<typeof timesheetTaskSchema>;
export type Timesheet = z.infer<typeof timesheetSchema>;
export type PayPeriod = {
    pay_period_id: string;
    start_date: string;
    end_date: string;
};
import { z } from "zod";

/*export const timesheetEntrySchema = z.object({
    /*
    projectId: z.string().min(1, "Project is required"),
    taskId: z.string().min(1, "Task is required"),
    timesheet_id: z.number(),
    project_id: z.number().optional(),
    timesheet_task_id: z.number().optional(),
    entry_date: z.date().optional(),
    time_in: z.string().optional(),
});*/

export const timesheetEntrySchema = z.object({
    timesheet_id: z.number().positive(),
    project_id: z.number().positive().optional(),
    timesheet_task_id: z.number().positive().optional(),
    entry_date: z.string().date(), // ISO date string (YYYY-MM-DD)
    time_in: z.string().datetime(), // ISO datetime string
    time_out: z.string().datetime().optional(),
    duration: z.number().optional(),
    mintues_paid: z.number().optional(),
    minutes_banked: z.number().optional(),
});

export const clockInSchema = z.object({
    timesheet_id: z.number().positive(),
    project_id: z.string().nullable().optional().transform(val => val || null),
    timesheet_task_id: z.string().nullable().optional().transform(val => val || null),
});

export const clockOutSchema = z.object({
    timesheet_entry_id: z.number().positive(),
    time_out: z.string().datetime(),
});

export const fullTimesheetEntrySchema = z.object({
    timesheet_entry_id: z.number().optional(),
    timesheet_id: z.number(),
    project_id: z.number().optional(),
    timesheet_task_id: z.number().optional(),
    entry_date: z.string().optional(),
    time_in: z.string().optional(),
    time_out: z.string().optional(),
    duration: z.number().optional(),
    updated_at: z.string().optional(),
})

export type TimesheetEntryFormData = z.infer<typeof timesheetEntrySchema>;
export type ClockInFormData = z.infer<typeof clockInSchema>;
export type ClockOutFormData = z.infer<typeof clockOutSchema>;
export type FullTimesheetEntryFormData = z.infer<typeof fullTimesheetEntrySchema>;
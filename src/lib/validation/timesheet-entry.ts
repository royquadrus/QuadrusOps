import { z } from "zod";

/*export const timesheetEditSchema = z.object({
    timesheet_entry_id: z.number(),
    timesheet_id: z.number(),
    project_id: z.number().optional(),
    timesheet_task_id: z.number().optional(),
    entry_date: z.string(),
    time_in: z.string(),
    time_out: z.string(),
    duration: z.number()
});

export type TimesheetEditFormData = z.infer<typeof timesheetEditSchema>;*/
export const editTimesheetEntrySchema = z.object({
    timesheet_entry_id: z.number().positive(),
    project_id: z.string(),
    timesheet_task_id: z.string(),
    time_in: z.date(),
    time_out: z.date(),
    entry_date: z.date(),
});

export const transposedEditTimesheetEntrySchema = z.object({
    project_id: z.number(),
    timesheet_task_id: z.number(),
    time_in: z.string(),
    time_out: z.string(),
    entry_date: z.string(),
});

export type EditTimesheetEntryFormData = z.infer<typeof editTimesheetEntrySchema>;
export type TransposedEditTimesheetEntryData = z.infer<typeof transposedEditTimesheetEntrySchema>;
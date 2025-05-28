import { z } from "zod";

export const editTimesheetEntrySchema = z.object({
    timesheet_entry_id: z.number().positive(),
    project_id: z.string(),
    timesheet_task_id: z.string(),
    time_in: z.date(),
    time_out: z.date(),
    entry_date: z.date(),
});

export const newTimesheetEntrySchema = z.object({
    project_id: z.string(),
    timesheet_task_id: z.string(),
    timesheet_id: z.number(),
    time_in: z.date(),
    time_out: z.date(),
    entry_date: z.date(),
});

export type EditTimesheetEntryFormData = z.infer<typeof editTimesheetEntrySchema>;
export type NewTimesheetEntryFormData = z.infer<typeof newTimesheetEntrySchema>;
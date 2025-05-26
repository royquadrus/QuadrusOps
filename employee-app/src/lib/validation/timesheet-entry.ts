import { z } from "zod";

export const timesheetEditSchema = z.object({
    timesheet_entry_id: z.number(),
    timesheet_id: z.number(),
    project_id: z.number().optional(),
    timesheet_task_id: z.number().optional(),
    entry_date: z.string(),
    time_in: z.string(),
    time_out: z.string(),
    duration: z.number()
});

export type TimesheetEditFormData = z.infer<typeof timesheetEditSchema>;
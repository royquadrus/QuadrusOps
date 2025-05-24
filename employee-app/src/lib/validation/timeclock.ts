import { z } from "zod";

export const timesheetEntrySchema = z.object({
    /*
    projectId: z.string().min(1, "Project is required"),
    taskId: z.string().min(1, "Task is required"),*/
    timesheet_id: z.number(),
    project_id: z.number().optional(),
    timesheet_task_id: z.number().optional(),
    entry_date: z.string().optional(),
    time_in: z.string().optional()
});

export type TimesheetEntryFormData = z.infer<typeof timesheetEntrySchema>;
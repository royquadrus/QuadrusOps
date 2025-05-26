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
export type FullTimesheetEntryFormData = z.infer<typeof fullTimesheetEntrySchema>;
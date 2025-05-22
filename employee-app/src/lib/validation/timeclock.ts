import { z } from "zod";

export const timesheetEntrySchema = z.object({
    projectId: z.string().min(1, "Project is required"),
    taskId: z.string().min(1, "Task is required"),
});

export type TimesheetEntryFormData = z.infer<typeof timesheetEntrySchema>;
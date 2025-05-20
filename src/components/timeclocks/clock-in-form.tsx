"use client";

import { TimesheetEntry } from "@/lib/validation/timesheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const clockInSchema = z.object({
    project_id: z.number(),
    timesheet_task_id: z.number(),
});

type ClockInFormValues = z.infer<typeof clockInSchema>;

interface ClockInFormProps {
    timesheetId: number,
    projects: { project_id: number; project_name: string }[];
    tasks: { timesheet_task_id: number; task_name: string }[];
    onSubmit: (entry: Omit<TimesheetEntry, "timesheet_entry_id">) => Promise<void>;
}

export function ClockInForm({
    timesheetId,
    projects,
    tasks,
    onSubmit,
}: ClockInFormProps) {
    const form = useForm<ClockInFormValues>({
        resolver: zodResolver(clockInSchema),
        defaultValues: {
            project_id: undefined,
            timesheet_task_id: undefined,
        },
    });

    const handleSubmit = async (values: ClockInFormValues)
}
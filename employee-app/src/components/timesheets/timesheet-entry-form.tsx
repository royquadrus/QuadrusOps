"use client";

import { TimesheetEntry } from "@/lib/validation/timesheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const entryFormSchema = z.object({
    entry_date: z.date(),
    time_in: z.string(),
    time_out: z.string().optional(),
    project_id: z.number().optional(),
    timesheet_task_id: z.number().optional(),
});

type EntryFormValues = z.infer<typeof entryFormSchema>;

interface TimesheetEntryFormProps {
    timesheetId: number;
    projects: { project_id: number; project_name: string }[];
    tasks: { timesheet_task_id: number; task_name: string }[];
    onSubmit: (entry: Omit<TimesheetEntry, "timesheet_entry_id">) => Promise<void>;
}

export function TimesheetEntryForm({
    timesheetId,
    projects,
    tasks,
    onSubmit,
}: TimesheetEntryFormProps) {
    const form = useForm<EntryFormValues>({
        resolver: zodResolver(entryFormSchema),
        defaultValues: {
            entry_date: new Date(),
            time_in: format(new Date(), "HH:mm"),
        },
    });

    const handleSubmit = async (values: EntryFormValues) => {
        await onSubmit({
            timesheet_id: timesheetId,
            entry_date: values.entry_date.toISOString(),
            time_in: new Date(
                values.entry_date.setHours(
                    parseInt(values.time_in.split(":")[0]),
                    parseInt(values.time_in.split(":")[1])
                )
            ).toISOString(),
            time_out: values.time_out
                ? new Date(
                    values.entry_date.setHours(
                        parseInt(values.time_out.split(":")[0]),
                        parseInt(values.time_out.split(":")[1])
                    )
                ).toISOString()
                : undefined,
            project_id: values.project_id,
            timesheet_task_id: values.timesheet_task_id,
        });
        form.reset({
            entry_date: new Date(),
            time_in: format(new Date(), "HH:mm"),
            time_out:undefined,
            project_id: undefined,
            timesheet_task_id: undefined,
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="entry_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant="outline" className="w-full flex justify-between">
                                                {field.value ? format(field.value, "PPP") : "Select date"}
                                                <CalendarIcon className="h-4 w-4" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="time_in"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Time In</FormLabel>
                                <FormControl>
                                    <div className="flex items-center">
                                        <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <Input type="time" {...field} />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="time_out"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Time Out (optional)</FormLabel>
                                <FormControl>
                                    <div className="flex items-center">
                                        <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <Input type="time" {...field} value={field.value || ""} />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="project_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project</FormLabel>
                                <Select
                                    value={field.value?.toString()}
                                    onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projects.map((project) => (
                                            <SelectItem
                                                key={project.project_id}
                                                value={project.project_id.toString()}
                                            >
                                                {project.project_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="timesheet_task_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Task (optional)</FormLabel>
                                <Select
                                    value={field.value?.toString()}
                                    onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a task" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tasks.map((task) => (
                                            <SelectItem
                                                key={task.timesheet_task_id}
                                                value={task.timesheet_task_id.toString()}
                                            >
                                                {task.task_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit">Add Time Entry</Button>
            </form>
        </Form>
    );
}
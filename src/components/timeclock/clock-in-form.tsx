"use client";

import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Button } from "../ui/button";
import { timesheetEntrySchema } from "@/lib/validation/timeclock";
import { useClockIn } from "@/hooks/use-clock-actions";

export function ClockInForm() {
    const { currentTimesheet, projects, tasks } = useTimeclockStore();
    const { isLoading, clockIn } = useClockIn();

    const form = useForm({
        resolver: zodResolver(timesheetEntrySchema),
        defaultValues: {
            projectId: "",
            taskId: "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(clockIn)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a project" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {projects.map((project) => (
                                        <SelectItem key={project.project_id} value={project.project_id.toString()}>
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
                    name="taskId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Task</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a task" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {tasks.map((task) => (
                                        <SelectItem key={task.timesheet_task_id} value={task.timesheet_task_id.toString()}>
                                            {task.task_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Clocking in..." : "Clock In"}
                </Button>
            </form>
        </Form>
    );
}
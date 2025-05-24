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

const NO_SELECTION =  "__none__";

export function ClockInForm() {
    const { currentTimesheet, projects, tasks } = useTimeclockStore();
    const { isLoading, clockIn } = useClockIn();

    const form = useForm({
        resolver: zodResolver(timesheetEntrySchema),
        defaultValues: {
            timesheet_id: currentTimesheet?.timesheet_id || 0,
            project_id: undefined,
            timesheet_task_id: undefined,
        },
    });

    const getProjectDisplayValue = (projectId: number | undefined) => {
        if (!projectId) return "No Project";
        const project = projects.find(p => p.project_id === projectId);
        return project ? `${project.project_number} - ${project.project_name}` : "No Project";
    }

    const getTaskDisplayValue = (taskId: number | undefined) => {
        if (!taskId) return "No Task";
        const task = tasks.find(t => t.timesheet_task_id === taskId);
        return task ? task.task_name : "No Task";
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(clockIn)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="project_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project</FormLabel>
                            <Select
                                onValueChange={(value) => {
                                    // Convert string back to number or null
                                    field.onChange(value === NO_SELECTION ? undefined : Number(value));
                                }}
                                value={field.value?.toString() || NO_SELECTION}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue>
                                            {getProjectDisplayValue(field.value)}
                                        </SelectValue>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={NO_SELECTION}>No Project</SelectItem>
                                    {projects.map((project) => (
                                        <SelectItem
                                            key={project.project_id}
                                            value={project.project_id.toString()}
                                        >
                                            {project.project_number} - {project.project_name}
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
                            <FormLabel>Task</FormLabel>
                            <Select
                                onValueChange={(value) => {
                                    // Convert string back to number or null
                                    field.onChange(value === NO_SELECTION ? undefined : Number(value));
                                }}
                                value={field.value?.toString() || NO_SELECTION}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue>
                                            {getTaskDisplayValue(field.value)}
                                        </SelectValue>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={NO_SELECTION}>No Task</SelectItem>
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

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Clocking in..." : "Clock In"}
                </Button>

                {/* Debug info - remove for production */}
                <div className="text-xs text-gray-500">
                    <div>Project ID: {form.watch("project_id") ?? "undefined"}</div>
                    <div>Task ID: {form.watch("timesheet_task_id") ?? "undefined"}</div>
                </div>
            </form>
        </Form>
    );
}
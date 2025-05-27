"use client";

import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Button } from "../ui/button";
import { clockInSchema } from "@/lib/validation/timeclock";
import { useClockActions } from "@/hooks/use-clock-actions";

export function ClockInForm() {
    const { currentTimesheet, projects, tasks } = useTimeclockStore();
    const { isLoading, clockIn } = useClockActions();

    //console.log('From clock-inform:', currentTimesheet);
    console.log(currentTimesheet);

    const form = useForm({
        resolver: zodResolver(clockInSchema),
        defaultValues: {
            timesheet_id: currentTimesheet?.timesheet_id ? parseInt(currentTimesheet.timesheet_id) : 0,
            project_id: "",
            timesheet_task_id: "",
        },
    });

    const getProjectDisplayValue = (projectId: string | undefined) => {
        if (!projectId) return "No Project";
        const project = projects.find(p => p.project_id.toString() === projectId);
        return project ? `${project.project_number} - ${project.project_name}` : "No Project";
    }

    const getTaskDisplayValue = (taskId: string | undefined) => {
        if (!taskId) return "No Task";
        const task = tasks.find(t => t.timesheet_task_id.toString() === taskId);
        return task ? task.task_name : "No Task";
    }

    const onSubmit = (data: any) => {
        console.log('Form submitted with data:', data);
        clockIn(data);
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="project_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value || ""}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a project">
                                            {getProjectDisplayValue(field.value || "")}
                                        </SelectValue>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
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
                            <FormMessage />
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
                                onValueChange={field.onChange}
                                value={field.value || ""}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a task">
                                            {getTaskDisplayValue(field.value || "")}
                                        </SelectValue>
                                    </SelectTrigger>
                                </FormControl>
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
                            <FormMessage />
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
                    <div>Form Valid: {form.formState.isValid ? "Yes" : "No"}</div>
                    <div>Form Errors: {JSON.stringify(form.formState.errors)}</div>
                </div>
            </form>
        </Form>
    );
}
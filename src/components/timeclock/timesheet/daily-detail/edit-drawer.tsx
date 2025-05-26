"use client";

import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditTimesheetEntry, useTimesheetEntries } from "@/hooks/use-todays-clock-ins";
import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { fullTimesheetEntrySchema } from "@/lib/validation/timeclock";
import { TimesheetEditFormData, timesheetEditSchema } from "@/lib/validation/timesheet-entry";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface EditDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedEntryId?: string;
}

const NO_SELECTION = "__none__";

export function EditDrawer({ isOpen, onOpenChange, selectedEntryId }: EditDrawerProps) {
    const { projects, tasks } = useTimeclockStore();
    const { timesheetEntry } = useTimesheetEntries();
    const { isLoading, editTimesheetEntry } = useEditTimesheetEntry();

    const form = useForm({
        resolver: zodResolver(fullTimesheetEntrySchema),
        defaultValues: {
            timesheet_id: undefined,
            timesheet_entry_id: undefined,
            project_id: undefined,
            timesheet_task_id: undefined,
            entry_date: undefined,
            time_in: undefined,
            time_out: undefined,
            duration: undefined,
        },
    });

    // Update form values when timesheetEntry changes
    useEffect(() => {
        if (timesheetEntry && isOpen) {
            form.reset({
                timesheet_id: timesheetEntry.timesheet_id,
                timesheet_entry_id: Number(timesheetEntry.timesheet_entry_id),
                project_id: timesheetEntry.project_id ? Number(timesheetEntry.project_id) : undefined,
                timesheet_task_id: timesheetEntry.timesheet_task_id ? Number(timesheetEntry.timesheet_task_id) : undefined,
                entry_date: timesheetEntry.entry_date ? new Date(timesheetEntry.entry_date).toISOString().split("T")[0] : undefined,
                time_in: timesheetEntry.time_in ? new Date(timesheetEntry.time_in).toISOString() : undefined,
                time_out: timesheetEntry.time_out ? new Date(timesheetEntry.time_out).toISOString() : undefined,
                duration: timesheetEntry.duration ? Number(timesheetEntry.duration) : undefined,
            })
        }
    }, [timesheetEntry, isOpen, form]);

    const getProjectDisplayValue = (projectId: number | undefined) => {
        if (!projectId) return "No project";
        const project = projects.find(p => p.project_id === projectId);
        return project ? `${project.project_number} - ${project.project_name}` : 'No Project';
    }

    const getTaskDisplayValue = (taskId: number | undefined) => {
        if (!taskId) return "No Task";
        const task = tasks.find(t => t.timesheet_task_id === taskId);
        return task ? task.task_name : "No Task";
    }

    const onSubmit = async (data: TimesheetEditFormData) => {
        try {
            await editTimesheetEntry(data);
            onOpenChange(false);
        } catch (error) {
            console.error("Error updateting timesheet entry:", error);
        }
    };

    const handleCancel = () => {
        form.reset();
        onOpenChange(false);
    }

    return (
        <Drawer direction="left" open={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Edit Clock In</DrawerTitle>
                    </DrawerHeader>
                    <div className="container mx-4 pb-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="project_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
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
                                <FormField
                                    control={form.control}
                                    name="time_in"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Time In</FormLabel>
                                            <FormControl>
                                                <DateTimePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Select time in"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="time_out"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Time Out</FormLabel>
                                            <FormControl>
                                                <DateTimePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Select time out"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-2 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1"
                                    >
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancel}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
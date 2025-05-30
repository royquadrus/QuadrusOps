"use client";

import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditTimesheetEntry, useTimesheetEntries } from "@/hooks/use-timesheet-entries-data";
import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { EditTimesheetEntryFormData, editTimesheetEntrySchema } from "@/lib/validation/timesheet-entry";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface EditDrawerProps {
    isOpen: boolean;
    onOpenChange: (wasUpdated?:boolean) => void;
}

export function EditDrawer({ isOpen, onOpenChange }: EditDrawerProps) {
    const { projects, tasks } = useTimeclockStore();
    const { timesheetEntry } = useTimesheetEntries();
    const { isLoading, editTimesheetEntry } = useEditTimesheetEntry();
    const [wasUpdated, setWasUpdated] = useState(false);

    const form = useForm<EditTimesheetEntryFormData>({
        resolver: zodResolver(editTimesheetEntrySchema),
        defaultValues: {
            timesheet_entry_id: timesheetEntry?.timesheet_entry_id || undefined,
            project_id: "",
            timesheet_task_id: "",
            time_in: new Date(),
            time_out: new Date(),
            entry_date: new Date(),
        }
    });

    useEffect(() => {
        if (timesheetEntry && isOpen) {
            //console.log("Bla:", timesheetEntry.time_in);
            form.reset({
                timesheet_entry_id: timesheetEntry?.timesheet_entry_id || undefined,
                project_id: timesheetEntry.project_id?.toString() || "",
                timesheet_task_id: timesheetEntry.timesheet_task_id?.toString() || "",
                time_in: timesheetEntry.time_in ? new Date(timesheetEntry.time_in) : undefined,
                time_out: timesheetEntry.time_out ? new Date(timesheetEntry.time_out) : undefined,
                entry_date: timesheetEntry.entry_date ? new Date(timesheetEntry.entry_date) : undefined,
            });
        }
    }, [timesheetEntry, isOpen, form]);

    const getProjectDisplayValue = (projectId: string | undefined) => {
        if (!projectId) return "No project";
        const project = projects.find(p => p.project_id.toString() === projectId);
        return project ? `${project.project_number} - ${project.project_name}` : 'No Project';
    }

    const getTaskDisplayValue = (taskId: string | undefined) => {
        if (!taskId) return "No Task";
        const task = tasks.find(t => t.timesheet_task_id.toString() === taskId);
        return task ? task.task_name : "No Task";
    }

    const onSubmit = async (data: EditTimesheetEntryFormData) => {
        try {
            await editTimesheetEntry(data);
            setWasUpdated(true);
            //onOpenChange(false, true);
            onOpenChange(true);
        } catch (error) {
            console.error("Error updating timesheet entry:", error);
        }
    };

    const handleCancel = useCallback(() => {
        form.reset();
        onOpenChange(wasUpdated);
    }, [form, onOpenChange, wasUpdated]);

    if (!timesheetEntry) return null;

    return (
        <Drawer
            direction="left"
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onOpenChange(wasUpdated);
                }
            }}
        >
            <DrawerContent className="max-w-2xl mx-auto">
                <DrawerHeader>
                    <DrawerTitle>Edit Clock In</DrawerTitle>
                </DrawerHeader>

                <div className="p-6 max-h-[80vh] overflow-y-auto">
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
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue>
                                                        {field.value ? getProjectDisplayValue(field.value) : "Select a project"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-popover border border-border shadow-lg backdrop-blue-sm">
                                                
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
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue>
                                                        {field.value ? getTaskDisplayValue(field.value) : "Select a task"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-popover border border-border shadow-lg backdrop-blur-sm">
                                                
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

                            {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4">*/}
                                <FormField
                                    control={form.control}
                                    name="time_in"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Time In</FormLabel>
                                            <FormControl>
                                                <div className="w-full">
                                                    <DateTimePicker
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Select time in"
                                                        format12Hour={true}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            {/*</div>*/}

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
                                                format12Hour={true}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
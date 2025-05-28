"use client";

import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNewTimesheetEntry } from "@/hooks/use-timesheet-entries-data";
import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { NewTimesheetEntryFormData, newTimesheetEntrySchema } from "@/lib/validation/timesheet-entry";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface NewDrawerProps {
    isOpen: boolean;
    onOpenChange: (wasUpdated?: boolean) => void;
}

export function NewDrawer({ isOpen, onOpenChange }: NewDrawerProps) {
    const { selectedDate, projects, tasks, selectedTimesheet } = useTimeclockStore();
    const { isLoading, newTimesheetEntry } = useNewTimesheetEntry();
    const [wasUpdated, setWasUpdated] = useState(false);

    const getDateTimeWithCurrentTime = (dateString: string) => {
        const now = new Date();
        const selectedDateTime = new Date(dateString + 'T00:00:00');

        selectedDateTime.setHours(now.getHours());
        selectedDateTime.setMinutes(now.getMinutes());
        selectedDateTime.setSeconds(now.getSeconds());
        selectedDateTime.setMilliseconds(now.getMilliseconds());

        return selectedDateTime;
    }

    const form = useForm<NewTimesheetEntryFormData>({
        resolver: zodResolver(newTimesheetEntrySchema),
        defaultValues: {
            timesheet_id: selectedTimesheet || undefined,
            project_id: "",
            timesheet_task_id: "",
            time_in: getDateTimeWithCurrentTime(selectedDate),
            time_out: getDateTimeWithCurrentTime(selectedDate),
            entry_date: new Date(selectedDate + 'T00:00:00'),
        },
    });

    useEffect(() => {
        if (isOpen) {
            const defaultDateTime = getDateTimeWithCurrentTime(selectedDate);
            form.reset({
                timesheet_id: selectedTimesheet || undefined,
                project_id: "",
                timesheet_task_id: "",
                time_in: defaultDateTime,
                time_out: defaultDateTime,
                entry_date: new Date(selectedDate + 'T00:00:00'),
            });
        }
    }, [isOpen, selectedDate, form]);

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

    const onSubmit = async (data:NewTimesheetEntryFormData) => {
        try {
            await newTimesheetEntry(data);
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

    return (
        <Drawer
            direction="right"
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onOpenChange(wasUpdated);
                }
            }}
        >
            <DrawerContent className="max-w-2xl mx-auto">
                <DrawerHeader>
                    <DrawerTitle>New Clock In</DrawerTitle>
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

                            <FormField
                                control={form.control}
                                name="time_out"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Time Out</FormLabel>
                                        <FormControl>
                                            <div className="w-full">
                                                <DateTimePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Select time out"
                                                    format12Hour={true}
                                                />
                                            </div>
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
                                    {isLoading ? "Saving..." : "New Clock In"}
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
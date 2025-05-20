"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePayPeriod } from "@/hooks/use-timeclocks";
import { useAuthSession } from "@/lib/utils/auth-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const clockInSchema = z.object({
    projectId: z.string().min(1, "Please select a project"),
    taskId: z.string().min(1, "Please select a task")
});

type ClockInFormData = z.infer<typeof clockInSchema>;

export default function TimeclockPage() {
    const { session } = useAuthSession();
    const { payPeriod, isLoading: isLoadingPayPeriod } = usePayPeriod();
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [dailyHours, setDailyHours] = useState(0);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);

    const form = useForm<ClockInFormData>({
        resolver: zodResolver(clockInSchema),
        defaultValues: {
            projectId: undefined,
            taskId: undefined,
        },
    });

    // Fetch projects
    useEffect(() => {
        async function fetchProjects() {
            try {
                const response = await fetch("/api/projects/active-projects");
                if(!response.ok) {
                    throw new Error("Failed to fetch projects");
                }
                const { data } = await response.json();
                setProjects(data);
            } catch (error) {
                toast.error("Failed to load projects");
                console.error(error);
            } finally {
                setIsLoadingProjects(false);
            }
        }

        fetchProjects();
    }, []);

    // Fetch timesheet tasks
    useEffect(() => {
        async function fetchTasks() {
            try {
                const response = await fetch("/api/timesheets/tasks");
                if (!response.ok) {
                    throw new Error("Failed to fetch timesheet tasks");
                }
                const { data } = await response.json();
                setTasks(data);
            } catch (error) {
                toast.error("Failed to load timesheet tasks");
                console.error(error);
            } finally {
                setIsLoadingTasks(false);
            }
        }

        fetchTasks();
    }, []);

    // Check if user is clocked in and get hours
    useEffect(() => {
        if (!payPeriod || !session) return;

        async function checkClockStatus() {
            try {
                setIsChecking(true);
                const response = await fetch(`/api/timesheets/check-clock-in-status?payPeriodId=${payPeriod?.pay_period_id}`);
                if (!response.ok) {
                    throw new Error("Failed to check clock in status");
                }
                const { isClockedIn, dailyHours } = await response.json();
                setIsClockedIn(isClockedIn);
                setDailyHours(dailyHours || 0);
            } catch (error) {
                toast.error("Failed to check clock in status");
                console.error(error);
            } finally {
                setIsChecking(false);
            }
        }

        checkClockStatus();
    }, [payPeriod, session]);

    async function onClockIn(data: ClockInFormData) {
        try {
            if (!payPeriod) {
                toast.error("No active pay period");
                return;
            }

            const response = await fetch("/api/timesheets/clock-in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    payPeriodId: payPeriod.pay_period_id,
                    projectId: data.projectId,
                    taskId: data.taskId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to clock in");
            }

            toast.success("Successfully clocked in");
            setIsClockedIn(true);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to clock in");
            console.log(error);
        }
    }

    if (isLoadingPayPeriod || isChecking) {
        return (
            <div className="container mx-auto py-8 flex items-center justify-center">
                <p>
                    Loading timeclock data...
                </p>
            </div>
        );
    }

    if (!payPeriod) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Timeclock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-destructive">
                            No active pay period found. Please contact your administrator.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Timeclock</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm test-muted-foreground">
                            Current Pay Period: {payPeriod.pay_period_id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Employee: {session?.user.email}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Total Hours Worked Today</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">
                        {dailyHours.toFixed(2)} hours
                    </p>
                </CardContent>
            </Card>

            {!isClockedIn && (
                <Card>
                    <CardHeader>
                        <CardTitle>Clock In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onClockIn)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="projectId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isLoadingProjects}
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
                                                disabled={isLoadingTasks}
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

                                <Button type="submit" className="w-full">Clock In</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
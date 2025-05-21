"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePayPeriod } from "@/hooks/use-timeclocks";
import { useAuthSession } from "@/lib/utils/auth-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const clockInSchema = z.object({
    projectId: z.string().min(1, "Please select a project"),
    taskId: z.string().min(1, "Please select a task")
});

type ClockInFormData = z.infer<typeof clockInSchema>;

interface CurrentTimeEntry {
    timesheet_entry_id: number;
    time_in: string;
    project_name: string;
    task_name: string;
}

interface TimesheetEntry {
    timesheet_entry_id: number;
    time_in: string;
    time_out: string | null;
    duration: number | null;
    project_name: string;
    task_name: string;
}

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
    const initialCheckDone = useRef(false);

    const [currentEntry, setCurrentEntry] = useState<CurrentTimeEntry | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [todayEntries, setTodayEntries] = useState<TimesheetEntry[]>([]);
    const [isClockingOut, setIsClockingOut] = useState(false);
    const [isLoadingEntries, setIsLoadingEntries] = useState(false);

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
        if (initialCheckDone.current) return;

        async function checkClockStatus() {
            try {
                setIsChecking(true);
                const response = await fetch(`/api/timesheets/check-clock-in-status?payPeriodId=${payPeriod?.pay_period_id}`);
                if (!response.ok) {
                    throw new Error("Failed to check clock in status");
                }
                const { isClockedIn, dailyHours, currentEntry } = await response.json();
                setIsClockedIn(isClockedIn);
                setDailyHours(dailyHours || 0);

                if (isClockedIn && currentEntry) {
                    setCurrentEntry(currentEntry);

                    // Calculate the initial elapsed time
                    const timeIn = new Date(currentEntry.time_in);
                    const now = new Date();
                    const initialElapsedSeconds = Math.floor((now.getTime() - timeIn.getTime()) / 1000);
                    setElapsedTime(initialElapsedSeconds);
                }

                // Fetch today's entries
                fetchTodayEntries();
                initialCheckDone.current = true;
            } catch (error) {
                toast.error("Failed to check clock in status");
                console.error(error);
            } finally {
                setIsChecking(false);
            }
        }

        checkClockStatus();
    }, [payPeriod, session]);

    // Fetch today's timesheet entries
    async function fetchTodayEntries() {
        if (!payPeriod) return;

        try {
            setIsLoadingEntries(true);
            const response = await fetch(`/api/timesheets/todays-entries?payPeriodId=${payPeriod.pay_period_id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch today's entries");
            }
            const { data } = await response.json();
            setTodayEntries(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingEntries(false);
        }
    }

    // Update timer every second
    useEffect(() => {
        if (!isClockedIn || !currentEntry) return;

        const timer = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isClockedIn, currentEntry]);

    // Format elapsed time as HH:MM:SS

    const formatElapsedTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    };

    // Format datetime for display
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

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

            const { data: entryData } = await response.json();
            toast.success("Successfully clocked in");
            setIsClockedIn(true);
            setCurrentEntry(entryData);
            setElapsedTime(0);

            // Refresh todays entries
            fetchTodayEntries();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to clock in");
            console.log(error);
        }
    }

    // Clock out function
    async function handleClockOut() {
        if (!currentEntry) return;

        try {
            setIsClockingOut(true);
            const response = await fetch("/api/timesheets/clock-out", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    timesheetEntryId: currentEntry.timesheet_entry_id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to clock out");
            }

            toast.success("Successfully clocked out");
            setIsClockedIn(false);
            setCurrentEntry(null);

            // Refresh data
            fetchTodayEntries();

            // Refresh daily hours
            const hoursResponse = await fetch(`/api/timesheets/check-clock-in-status&payPeriodId=${payPeriod?.pay_period_id}`);
            if (hoursResponse.ok) {
                const { dailyHours } = await hoursResponse.json();
                setDailyHours(dailyHours || 0);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to clock out");
            console.error(error);
        } finally {
            setIsClockingOut(false);
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
            {isClockedIn && currentEntry ? (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>Currently Clocked In</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium">Clocked In At</p>
                                    <p>{formatDateTime(currentEntry.time_in)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Project</p>
                                    <p>{currentEntry.project_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Task</p>
                                    <p>{currentEntry.task_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Time Elapsed</p>
                                    <p className="text-xl font-bold">{formatElapsedTime(elapsedTime)}</p>
                                </div>
                            </div>

                            <Button
                                className="w-full"
                                variant="destructive"
                                onClick={handleClockOut}
                                disabled={isClockingOut}
                            >
                                {isClockingOut ? "Clocking Out..." : "Clock Out"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Today's Timesheet Entries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoadingEntries ? (
                                <p>Loading entries...</p>
                            ) : todayEntries.length === 0 ? (
                                <p className="text-muted-foreground">No entries for today yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {todayEntries.map(entry => (
                                        <div key={entry.timesheet_entry_id} className="border rounded-md p-4">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-sm font-medium">Project</p>
                                                    <p>{entry.project_name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Task</p>
                                                    <p>{entry.task_name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Time In</p>
                                                    <p>{formatDateTime(entry.time_in)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Time Out</p>
                                                    <p>{entry.time_out ? formatDateTime(entry.time_out) : 'Active'}</p>
                                                </div>
                                                {entry.duration !== null && (
                                                    <div className="col-span-2">
                                                        <p className="text-sm font-medium">Duration</p>
                                                        <p>{(entry.duration / 60).toFixed(2)} hours</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
}
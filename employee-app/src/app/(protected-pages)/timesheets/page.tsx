"use client";

import { PayPeriodSelect } from "@/components/timesheets/pay-period-select";
import { TimesheetEntriesTable } from "@/components/timesheets/timesheet-entries-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePayPeriods, useTimesheetEntries, useTimesheets } from "@/hooks/use-timesheets";
import { useAuthSession } from "@/lib/utils/auth-utils";
import { Timesheet, TimesheetEntry } from "@/lib/validation/timesheet";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TimesheetsPage() {
    const { session } = useAuthSession();
    const [selectedPayPeriodId, setSelectedPayPeriodId] = useState<string | null>(null);
    const [currentTimesheet, setCurrentTimesheet] = useState<Timesheet | null>(null);

    // Fetch projects and tasks for the dropdown selectors
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);

    const { payPeriods, isLoading: isLoadingPayPeriods } = usePayPeriods();
    const { timesheets, isLoading: isLoadingTimesheets, createTimesheet } = useTimesheets(
        selectedPayPeriodId || undefined
    );
    const { entries, isLoading: isLoadingEntries, createEntry } = useTimesheetEntries(
        currentTimesheet?.timesheet_id
    );

    useEffect(() => {
        async function fetchProjects() {
            try {
                const response = await fetch("/api/active-projects");
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            }
        }

        // Fetch timesheet task
        async function fetchTasks() {
            try {
                const response = await fetch("/api/timesheet-tasks");
                if (response.ok) {
                    const data = await response.json();
                    setTasks(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch timesheet tasks:", error);
            }
        }

        fetchProjects();
        fetchTasks();
    }, []);

    useEffect(() => {
        if (!isLoadingTimesheets && timesheets.length > 0) {
            setCurrentTimesheet(timesheets[0]);
        } else if (!isLoadingTimesheets && timesheets.length === 0 && selectedPayPeriodId) {
            setCurrentTimesheet(null);
        }
    }, [timesheets, isLoadingTimesheets, selectedPayPeriodId]);

    const handlePeriodSelect = async (periodId: string) => {
        setSelectedPayPeriodId(periodId);
    };

    const handleCreateTimesheet = async () => {
        if (!selectedPayPeriodId || !session?.user) return;

        try {
            // Get the employee id for the current user
            const response = await fetch(`api/employee?email=${session.user.email}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            const { data: employee } = await response.json();

            const newTimesheet = await createTimesheet({
                employee_id: employee.employee_id,
                pay_period_id: selectedPayPeriodId,
                status: "Open",
            });

            setCurrentTimesheet(newTimesheet);
            toast.success("Timesheet created successfully");
        } catch (error) {
            toast.error("Failed to create timesheet");
            console.error(error);
        }
    };

    const handleAddEntry = async (entry: Omit<TimesheetEntry, "timesheet_entry_id">) => {
        try {
            await createEntry(entry);
            toast.success("Time entry added successfully");
        } catch (error) {
            toast.error("Failed to add time entry");
            console.error(error);
        }
    };

    const payPeriodDateRange = () => {
        if (!selectedPayPeriodId) return "";

        const period = payPeriods.find(p => p.pay_period_id === selectedPayPeriodId);
        if(!period) return "";

        return `${format(new Date(period.start_date), "MMM d, yyyy")} - ${
            period.end_date ? format(new Date(period.end_date), "MMM d, yyyy") : "Present"
        }`;
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Select Pay Period</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <PayPeriodSelect
                            payPeriods={payPeriods}
                            selectedPayPeriodId={selectedPayPeriodId}
                            onSelect={handlePeriodSelect}
                            isLoading={isLoadingPayPeriods}
                        />

                        <div className="flex items-end">
                            {currentTimesheet ? (
                                <div className="text-sm text-muted-foreground">
                                    Timesheet already exists for {payPeriodDateRange()}
                                </div>
                            ) : (
                                <Button
                                    onClick={handleCreateTimesheet}
                                    disabled = {!selectedPayPeriodId || isLoadingTimesheets}
                                >
                                    Create Timesheet
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
import { PayPeriod, Timesheet, TimesheetEntry } from "@/lib/validation/timesheet";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function usePayPeriods() {
    const [payPeriods, setPayPeriods] = useState<PayPeriod[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchPayPeriods() {
            try {
                const response = await fetch("/api/pay-periods");
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error);
                }

                const { data } = await response.json();
                setPayPeriods(data);
            } catch (error) {
                toast.error("Failed to fetch pay periods");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPayPeriods();
    }, []);

    return { payPeriods, isLoading };
}

export function useTimesheets(payPeriodId?: string) {
    const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchTimesheets() {
            if (!payPeriodId) {
                setTimesheets([]);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/timesheets?pay_period_id=${payPeriodId}`);
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error);
                }

                const { data } = await response.json();
                setTimesheets(data);
            } catch (error) {
                toast.error("Failed to fetch timesheets");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTimesheets();
    }, [payPeriodId]);

    async function createTimesheet(timesheet: Omit<Timesheet, "timesheet_id">) {
        try {
            const response = await fetch("/api/timesheets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(timesheet),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            const { data } = await response.json();
            setTimesheets((prev) => [...prev, data[0]]);
            return data[0];
        } catch (error) {
            toast.error("Failed to create timesheet");
            console.error(error);
            throw error;
        }
    }

    return { timesheets, isLoading, createTimesheet };
}

export function useTimesheetEntries(timesheetId?: number) {
    const [entries, setEntries] = useState<TimesheetEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchEntries() {
            if (!timesheetId) {
                setEntries([]);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/timesheet-entries?timesheet_id=${timesheetId}`);
                if(!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error);
                }

                const { data } = await response.json();
                setEntries(data);
            } catch (error) {
                toast.error("Failed to fetch timesheet entries");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchEntries();
    }, [timesheetId]);

    async function createEntry(entry: Omit<TimesheetEntry, "timesheet_entry_id">) {
        try {
            const response = await fetch("/api/timesheet-entries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(entry),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            const { data } = await response.json();
            setEntries((prev) => [...prev, data[0]]);
            return data[0];
        } catch (error) {
            toast.error("Failed to create timesheet entry");
            console.error(error);
            throw error;
        }
    }

    return { entries, isLoading, createEntry };
}
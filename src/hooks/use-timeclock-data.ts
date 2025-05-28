import { ActiveEntry, Project, Task, Timesheet, useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { PayPeriod } from "@/lib/validation/bak-timesheet";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useTimeclockData() {
    const {
        // State
        payPeriods,
        currentPayPeriod,
        selectedPayPeriod,
        currentTimesheet,
        selectedTimesheet,
        timesheetDays,
        activeEntry,
        projects,
        tasks,
        isDataLoading,
        isLoading,
        error,

        // Actions
        setPayPeriods,
        setCurrentPayPeriod,
        setSelectedPayPeriod,
        setCurrentTimesheet,
        setSelectedTimesheet,
        setTimesheetDays,
        setActiveEntry,
        setProjects,
        setTasks,
        setDataLoading,
        setLoading,
        setError,
        clearError,
    } = useTimeclockStore();

    // API fetch functions
    const fetchCurrentPayPeriod = useCallback(async (): Promise<PayPeriod | null> => {
        try {
            const response = await fetch("/api/timeclock/current-pay-period");
            if (!response.ok) {
                throw new Error("Failed to fetch current pay period");
            }

            const { data } = await response.json();
            return data ? {
                pay_period_id: data.pay_period_id,
                start_date: data.start_date,
                end_date: data.end_date,
            } : null;
        } catch (error) {
            console.error("Error fetching current pay period:", error);
            toast.error("Failed to fetch current pay period.");
            return null;
        }
    }, []);

    const fetchPayPeriods = useCallback(async () => {
        try {
            setLoading(true);
            clearError();

            const response = await fetch('/api/timeclock/last-52-pay-periods');
            if (!response.ok) {
                throw new Error("Failed to fetch pay periods");
            }

            const data = await response.json();
            setPayPeriods(data.data || data.payPeriods || []);

            if (data.currentPayPeriod) {
                setCurrentPayPeriod(data.currentPayPeriod);
                if (!selectedPayPeriod) {
                    setSelectedPayPeriod(data.currentPayPeriod);
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch pay periods";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [setPayPeriods, setCurrentPayPeriod, setSelectedPayPeriod, selectedPayPeriod, setLoading, setError, clearError]);

    const fetchOrCreateTimesheet = useCallback(async (userEmail: string, payPeriodId: string): Promise<Timesheet | null> => {
        try {
            const response = await fetch(`/api/timeclock/timesheet?payPeriodId=${payPeriodId}`);

            if (!response.ok) {
                throw new Error("Failed to fetch or create timesheet.");
            }

            const { timesheetId } = await response.json();
            return {
                timesheet_id: timesheetId,
                pay_period_id: payPeriodId,
                userEmail: userEmail,
            };
        } catch (error) {
            console.error("Error fetching or creating timesheet:", error);
            toast.error("Failed to fetch or create timesheet");
            return null;
        }
    }, []);

    const fetchActiveEntry = useCallback(async (timesheetId: string): Promise<ActiveEntry | null> => {
        try {
            const response = await fetch(`/api/timeclock/timesheet-entries/active-clock-in?timesheetId=${timesheetId}`);

            if (!response.ok) {
                throw new Error("Failed to fetch active entry");
            }

            const { formattedData } = await response.json();
            if (formattedData) {
                return {
                    timesheet_entry_id: formattedData.timesheet_entry_id,
                    time_in: formattedData.time_in,
                    project_name: formattedData.project_name,
                    task_name: formattedData.task_name
                };
            }

            return null;
        } catch (error) {
            console.error("Error fetching current punch in:", error);
            toast.error("Failed to fetch current punch in");
            return null;
        }
    }, []);

    const fetchTimesheetDays = useCallback(async (payPeriodId: string) => {
        try {
            setLoading(true);
            clearError();

            const response = await fetch(`/api/timeclock/pay-period-timesheet?payPeriodId=${payPeriodId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch timesheet data");
            }

            const data = await response.json();
            setSelectedTimesheet(data.timesheet[0].timesheet_id);
            
            setTimesheetDays(data.timesheet || []);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch timesheet data';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [setTimesheetDays, setLoading, setError, clearError]);

    const fetchProjects = useCallback(async (): Promise<Project[]> => {
        try {
            const response = await fetch("/api/timeclock/projects");

            if (!response.ok) {
                throw new Error("Failed to fetch projects");
            }

            const { data } = await response.json();
            return data || [];
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Failed to fetch projects");
            return [];
        }
    }, []);

    const fetchTasks = useCallback(async (): Promise<Task[]> => {
        try { 
            const response = await fetch("/api/timeclock/tasks");

            if (!response.ok) {
                throw new Error("Failed to fetch timesheet tasks");
            }

            const { data } = await response.json();
            return data || [];
        } catch (error) {
            console.error("Error fetching timesheet tasks:", error);
            toast.error("Failed to fetch timesheet tasks");
            return [];
        }
    }, []);

    // Complete initialization function (for main timeclock route)
    const initializeTimeclockData = useCallback(async (userEmail: string) => {
        setDataLoading(true);
        try {
            // First get current pay period
            const payPeriod = await fetchCurrentPayPeriod();
            setCurrentPayPeriod(payPeriod);

            // IF we have a pay period, get or create timesheet
            if (payPeriod) {
                const timesheet = await fetchOrCreateTimesheet(userEmail, payPeriod.pay_period_id);
                setCurrentTimesheet(timesheet);

                // If we have atimesheet, check for active entry
                if (timesheet) {
                    const activeEntry = await fetchActiveEntry(timesheet.timesheet_id);
                    setActiveEntry(activeEntry);
                }
            }

            // Load all reference data in parallel
            await Promise.all([
                fetchPayPeriods(),
                fetchProjects().then(setProjects),
                fetchTasks().then(setTasks)
            ]);
        } catch (error) {
            console.error("Failed to initialize timeclock data", error);
            setError("Failed to initialize timeclock data");
        } finally {
            setDataLoading(false);
        }
    }, [
        fetchCurrentPayPeriod,
        setCurrentPayPeriod,
        fetchOrCreateTimesheet,
        setCurrentTimesheet,
        fetchActiveEntry,
        setActiveEntry,
        fetchPayPeriods,
        fetchProjects,
        setProjects,
        fetchTasks,
        setTasks,
        setDataLoading,
        setError
    ]);

    // Load pay periods on mount (for other routes that need pay period data)
    useEffect(() => {
        if (payPeriods.length === 0) {
            fetchPayPeriods();
        }
    }, [fetchPayPeriods, payPeriods.length]);

    // Load timesheet days when selected pay period changes
    useEffect(() => {
        if (selectedPayPeriod?.pay_period_id) {
            fetchTimesheetDays(selectedPayPeriod.pay_period_id);
        }
    }, [selectedPayPeriod?.pay_period_id, fetchTimesheetDays]);

    return {
        // State
        payPeriods,
        currentPayPeriod,
        selectedPayPeriod,
        currentTimesheet,
        timesheetDays,
        activeEntry,
        projects,
        tasks,
        isDataLoading,
        isLoading,
        error,

        // Actions
        setSelectedPayPeriod,

        // Refetch functions
        refetchPayPeriods: fetchPayPeriods,
        refetchTimesheetDays: () => selectedPayPeriod && fetchTimesheetDays(selectedPayPeriod.pay_period_id),
        refetchActiveEntry: () => currentTimesheet && fetchActiveEntry(currentTimesheet.timesheet_id),

        // INitialize (for main timeclock route)
        initializeTimeclockData,

        // Individual fetch function 
        fetchCurrentPayPeriod,
        fetchOrCreateTimesheet,
        fetchActiveEntry,
        fetchProjects,
        fetchTasks,
    };
}
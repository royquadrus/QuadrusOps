import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { useCallback, useState } from "react";
import { toast, Toaster } from "sonner";

export function useTimeclockData() {
    const [isDataLoading, setIsDataLoading] = useState(true);
    const {
        setCurrentPayPeriod,
        setCurrentTimesheet,
        setActiveEntry,
        setLast52PayPeriods,
        setProjects,
        setTasks
    } = useTimeclockStore();

    const fetchCurrentPayPeriod = useCallback(async () => {
        try {
            const response = await fetch("/api/timeclock/current-pay-period");
            if (!response.ok) {
                throw new Error("Failed to fetch current pay period");
            }
            const { data } = await response.json();
            return data ? {
                id: data.pay_period_id,
                startDate: data.start_date,
                endDate: data.end_date
            } : null;
        } catch (error) {
            console.error("Error fetching current pay period:", error);
            toast.error("Failed to fecth current pay period");
            return null;
        }
    }, []);

    const fetchorCreateTimesheet = useCallback(async (userEmail: string, payPeriodId: string) => {
        try {
            const response = await fetch(`/api/timeclock/timesheet?payPeriodId=${payPeriodId}`);

            if (!response.ok) {
                throw new Error("Failed to fetch or create timesheet.");
            }

            const { timesheetId } = await response.json();
            return {
                id: timesheetId,
                payPeriodId: payPeriodId,
                userEmail: userEmail
            };
        } catch (error) {
            console.error("Error fetching or creating timesheet:", error);
            toast.error("Failed to fetch or create timesheet");
            return null;
        }
    }, []);

    const fetchActiveEntry = useCallback(async (timesheetId: string) => {
        try {
            const response = await fetch(`/api/timeclock/current-punch-in?timesheetId=${timesheetId}`);

            if (!response.ok) {
                throw new Error("Failed to fetch active entry");
            }

            const { formattedPunchIn } = await response.json();
            if (formattedPunchIn) {
                return {
                    id: formattedPunchIn.timesheet_entry_id,
                    timeIn: formattedPunchIn.time_in,
                    projectName: formattedPunchIn.project_name,
                    taskName: formattedPunchIn.task_name
                };
            }

            return null;
        } catch (error) {
            console.error("Error fetching current punch in:", error);
            toast.error("Failed to fetch current punch in");
            return null;
        }
    }, []);

    const fetchLast52PayPeriods = useCallback(async () => {
        try {
            const response = await fetch('/api/timeclock/last-52-pay-periods');

            if (!response.ok) {
                throw new Error("Failed to fetch last 52 pay periods.");
            }

            const { data } = await response.json();
            return data || [];
        } catch (error) {
            console.error("Error fetching last 52 pay periods:", error);
            toast.error("Failed to fetch last 52 pay periods.");
            return [];
        }
    }, []);

    const fetchProjects = useCallback(async () => {
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

    const fetchTasks = useCallback(async () => {
        try {
            const response = await fetch("/api/timeclock/tasks");

            if (!response.ok) {
                throw new Error("Failed to fetch timesheet tasks");
            }

            const { data } = await response.json();
            return data || [];
        } catch (error) {
            console.error("Error fetching timsheet tasks:", error);
            toast.error("Failed to fetch timesheet tasks");
            return [];
        }
    }, []);

    const initializeTimeclockData = useCallback(async (userEmail: string) => {
        setIsDataLoading(true);
        try {
            const payPeriod = await fetchCurrentPayPeriod();
            setCurrentPayPeriod(payPeriod);

            if (payPeriod) {
                const timesheet = await fetchorCreateTimesheet(userEmail, payPeriod.id);
                setCurrentTimesheet(timesheet);

                if (timesheet) {
                    const activeEntry = await fetchActiveEntry(timesheet.id);
                    setActiveEntry(activeEntry);
                }
            }

            await Promise.all([
                fetchLast52PayPeriods().then(setLast52PayPeriods),
                fetchProjects().then(setProjects),
                fetchTasks().then(setTasks)
            ]);
        } catch (error) {
            console.error("Failed to initialize timeclock data", error);
        } finally {
            setIsDataLoading(false);
        }
    }, [
        fetchCurrentPayPeriod,
        setCurrentPayPeriod,
        fetchorCreateTimesheet,
        setCurrentTimesheet,
        fetchActiveEntry,
        setActiveEntry,
        fetchLast52PayPeriods,
        setLast52PayPeriods,
        fetchProjects,
        setProjects,
        fetchTasks,
        setTasks
    ]);

    return {
        isDataLoading,
        initializeTimeclockData
    };
}
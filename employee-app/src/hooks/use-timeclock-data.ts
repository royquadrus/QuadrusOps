import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useTimeclockData() {
    const [isDataLoading, setIsDataLoading] = useState(true);
    const {
        setCurrentPayPeriod,
        setCurrentTimesheet,
        setActiveEntry,
        setProjects,
        setTasks
    } = useTimeclockStore();

    const fetchCurrentPayPeriod = useCallback(async () => {
        // Fetch current pay period logic
    }, []);

    const fetchorCreateTimesheet = useCallback(async (userEmail: string, payPeriodId: string) => {
        // Fetch or create timesheet logic
    }, []);

    const fetchActiveEntry = useCallback(async (timesheetId: string) => {
        // Fetch active entry logic (entry with null time_out)
    }, []);

    const fetchProjects = useCallback(async () => {
        // Fetch projects logic
    }, []);

    const fetchTasks = useCallback(async () => {
        // Fetch tasks logic
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
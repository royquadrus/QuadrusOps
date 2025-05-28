import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface ClockInEntry {
    timesheet_entry_id: string;
    time_in: string;
    time_out: string;
    task_name: string;
    project_name: string;
    duration: string;
}

interface UseTodaysClockInsReturn {
    clockIns: ClockInEntry[];
    isLoading: boolean;
    refetch: () => Promise<void>;
}

export function useTodaysClockIns(): UseTodaysClockInsReturn {
    const [clockIns, setClockIns] = useState<ClockInEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { currentTimesheet} = useTimeclockStore();

    const fetchClockIns = useCallback(async () => {
        if (!currentTimesheet) {
            setClockIns([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);

            const response = await fetch(`/api/timeclock/timesheet-entries/todays-clock-ins?timesheetId=${currentTimesheet.timesheet_id}`);

            if (!response.ok) {
                const errroData = await response.json();
                throw new Error(errroData.error || 'Failed to fetch clock-ins');
            }

            const data = await response.json();
            //console.log(data);
            setClockIns(data.formattedPunchIns || []);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to fetch clock-ins');
            setClockIns([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentTimesheet]);

    useEffect(() => {
        fetchClockIns();
    }, [fetchClockIns]);

    return {
        clockIns,
        isLoading,
        refetch: fetchClockIns,
    };
}
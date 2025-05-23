import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface ClockInEntry {
    id: string;
    timeIn: string;
    timeOut: string;
    taskName: string;
    projectName: string;
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
    const [error, setError] = useState<string | null>(null);
    const { currentTimesheet} = useTimeclockStore();

    const fetchClockIns = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/timeclock/todays-clock-ins?timesheetId=${currentTimesheet.id}`);

            if (!response.ok) {
                const errroData = await response.json();
                throw new Error(errroData.error || 'Failed to fetch clock-ins');
            }

            const data = await response.json();
            //console.log(data);
            setClockIns(data.formattedPunchIns || []);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to fetch clock-ins');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClockIns();
    }, [fetchClockIns]);

    return {
        clockIns,
        isLoading,
        refetch: fetchClockIns,
    };
}
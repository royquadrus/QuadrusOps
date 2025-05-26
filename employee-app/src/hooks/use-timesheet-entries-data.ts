import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface ClockInEntry {
    timesheet_entry_id: string;
    time_in: string;
    time_out: string;
    project_name: string;
    duration: number;
};

interface UseDailyPunchesReturn {
    clockIns: ClockInEntry[];
    isLoading: boolean;
    refetch: () => Promise<void>;
};

export function useDailyPunches(): UseDailyPunchesReturn {
    const [clockIns, setClockIns] = useState<ClockInEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { selectedDate } = useTimeclockStore();

    const fetchClockIns = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/timeclock/get-daily-punches?day=${selectedDate}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch clock ins');
            }

            const data = await response.json();
            setClockIns(data.data || []);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to fetch clock-ins");
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        // Only fetch if we have a selectedDate
        if (selectedDate) 
            fetchClockIns();
    }, [fetchClockIns]);

    return {
        clockIns,
        isLoading,
        refetch: fetchClockIns,
    };
}
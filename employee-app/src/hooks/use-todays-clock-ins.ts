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

interface TimesheetEntry {
    timesheet_entry_id: number | null;
    timesheet_id: number;
    project_id: number | null;
    timesheet_task_id: number | null;
    entry_date: string | null;
    time_in: string | null;
    time_out: string | null;
    duration: number | null;
}

export function useTodaysClockIns(): UseTodaysClockInsReturn {
    const [clockIns, setClockIns] = useState<ClockInEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentTimesheet} = useTimeclockStore();

    const fetchClockIns = useCallback(async () => {
        if (!currentTimesheet) {
            setClockIns([]);
            return;
        }

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

export function useTimesheetEntries() {
    const [isLoading, setIsLoading] = useState(false);
    const [timesheetEntry, setTimesheetEntry] = useState<TimesheetEntry | null>(null);
    const { selectedEntry } = useTimeclockStore();

    const fetchTimesheetEntry = useCallback(async () => {
        if (!selectedEntry) {
            setTimesheetEntry(null);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`/api/timeclock/selected-timesheet-entry?timesheetEntryId=${selectedEntry}`);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error || 'Failed to fetch timesheet entry');
            }

            const data = await response.json();
            console.log('Hook entry data:', data);
            setTimesheetEntry(data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to fetch timesheet entry.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedEntry]);

    useEffect(() => {
        fetchTimesheetEntry();
    }, [fetchTimesheetEntry]);

    return {
        timesheetEntry,
        isLoading
    };
}

export function useEditTimesheetEntry() {
    const [isLoading, setIsLoading] = useState(false);

    async function editTimesheetEntry(data: any) {
        try {
            setIsLoading(true);

            const response = await fetch('/api/timeclock/selected-timesheet-entry', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    entry_date: new Date(data.time_in).toISOString().split('T')[0],
                    duration: Math.floor((new Date(data.time_out).getTime() - new Date(data.time_in).getTime()) / (1000 * 60)),
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            toast.success("Succesfully edited timesheet entry");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update timesheet entry');
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, editTimesheetEntry };
}
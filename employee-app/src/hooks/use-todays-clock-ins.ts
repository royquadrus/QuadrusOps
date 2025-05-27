import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { EditTimesheetEntryFormData, editTimesheetEntrySchema } from "@/lib/validation/timesheet-entry";
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
    const { currentTimesheet} = useTimeclockStore();

    const fetchClockIns = useCallback(async () => {
        if (!currentTimesheet) {
            setClockIns([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);

            const response = await fetch(`/api/timeclock/todays-clock-ins?timesheetId=${currentTimesheet.timesheet_id}`);

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

export function useTimesheetEntries() {
    const [isLoading, setIsLoading] = useState(false);
    const [timesheetEntry, setTimesheetEntry] = useState<TimesheetEntry | null>(null);
    const { selectedEntry } = useTimeclockStore();

    const fetchTimesheetEntry = useCallback(async () => {
        if (!selectedEntry) {
            setTimesheetEntry(null);
            setIsLoading(false);
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
            //console.log('Hook entry data:', data);
            setTimesheetEntry(data.data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to fetch timesheet entry.');
            setTimesheetEntry(null);
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

    async function editTimesheetEntry(data: EditTimesheetEntryFormData) {
        try {
            setIsLoading(true);
            //console.log(data);
            const validatedData = editTimesheetEntrySchema.parse(data);
            //console.log(validatedData);

            const response = await fetch('/api/timeclock/timesheet-entries/edit-timesheet-entry', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ validatedData }),
            });

            //console.log('Back from api');
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            toast.success('Successfully updated clock in.');
        
            /*const sendData = {
                timesheet_entry_id: null,
                project_id: Number(data.project_id) || null,
                timesheet_task_id: Number(data.timesheet_task_id) || null,
                time_in: new Date(data.time_in).toISOString(),
                entry_date: new Date(data.entry_date).toISOString().split("T")[0],
                time_out: new Date(data.time_out).toISOString(),
                duration: Math.floor((new Date(data.time_out).getTime() - new Date(data.time_in).getTime()) / (1000 * 60)),
                updated_at: new Date().toISOString(),
            }

            console.log("After modification:", sendData);

            const response = await fetch('/api/timeclock/selected-timesheet-entry', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    entry_date: new Date(data.time_in),
                    duration: Math.floor((new Date(data.time_out).getTime() - new Date(data.time_in).getTime()) / (1000 * 60)),
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            toast.success("Succesfully edited timesheet entry");*/
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update timesheet entry');
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, editTimesheetEntry };
}
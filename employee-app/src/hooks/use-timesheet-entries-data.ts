import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { EditTimesheetEntryFormData, editTimesheetEntrySchema, NewTimesheetEntryFormData, newTimesheetEntrySchema } from "@/lib/validation/timesheet-entry";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface ClockInEntry {
    timesheet_entry_id: string;
    time_in: string;
    time_out: string;
    project_name: string;
    duration: number;
};

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
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update timesheet entry');
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, editTimesheetEntry };
}

export function useNewTimesheetEntry() {
    const [isLoading, setIsLoading] = useState(false);

    async function newTimesheetEntry(data: NewTimesheetEntryFormData) {
        try {
            setIsLoading(true);

            const validatedData = newTimesheetEntrySchema.parse(data);

            const response = await fetch('/api/timeclock/timesheet-entries/new-timesheet-entry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ validatedData }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            toast.success('Successfully created clock in.');
        
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to create timesheet entry');
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, newTimesheetEntry };
}

export function useSubmitTimesheet() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function submitTimesheet(data: number) {
        try {
            setIsSubmitting(true);

            const response = await fetch('/api/timeclock/timesheet/submit-timesheet', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            toast.success('Timesheet has been submitted');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to submit timesheet');
        } finally {
            setIsSubmitting(false);
        }
    }

    return { isSubmitting, submitTimesheet };
}
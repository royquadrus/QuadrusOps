import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { useState } from "react";
import { toast } from "sonner";

export function useClockActions() {
    const [isLoading, setIsLoading] = useState(false);
    const { currentTimesheet, setActiveEntry } = useTimeclockStore();

    async function clockIn(data: any) {
        try {
            setIsLoading(true);
            if (!currentTimesheet) {
                throw new Error('Current timesheet is required.');
            }

            const response = await fetch('/api/timeclock/timesheet-entries/clock-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    timesheet_id: currentTimesheet.timesheet_id,
                    project_id: data.project_id,
                    timesheet_task_id: data.timesheet_task_id,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            const { formattedData } = await response.json();

            setActiveEntry(formattedData);

            toast.success('Successfully clocked in');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to clock in');
        } finally {
            setIsLoading(false);
        }
    }

    async function clockOut(entryId: string) {
        try {
            setIsLoading(true);

            const response = await fetch('/api/timeclock/timesheet-entries/clock-out', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entryId }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            setActiveEntry(null);

            toast.success('Successfully clocked out');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to clock out');
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, clockIn, clockOut };
}
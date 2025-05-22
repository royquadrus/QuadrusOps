import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { useState } from "react";
import { toast } from "sonner";

export function useClockIn() {
    const [isLoading, setIsLoading] = useState(false);
    const { currentTimesheet, setActiveEntry } = useTimeclockStore();

    async function clockIn(data: any) {
        try {
            setIsLoading(true);

            const response = await fetch("/api/timeclock/current-punch-in", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    timesheetId: currentTimesheet.id,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            const { data: newEntry } = await response.json();
            setActiveEntry(newEntry);

            toast.success("Successfully clocked in");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to clock in');
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, clockIn };
}

export function useClockOut() {
    const [isLoading, setIsLoading] = useState(false);
    const { setActiveEntry } = useTimeclockStore();

    async function clockOut(entryId: string) {
        try {
            setIsLoading(true);

            const response = await fetch('/api/timeclock/current-punch-in', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entryId }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            setActiveEntry(null);

            toast.success("Successfully clocked out");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to clock out");
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, clockOut };
}
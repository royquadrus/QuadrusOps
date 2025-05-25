"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDailyPunches } from "@/hooks/use-timesheet-entries-data";
import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { formatDuration } from "@/lib/utils/time-utils";
import { format } from "date-fns";

export function DailyPunchesList() {
    const { clockIns, isLoading, refetch } = useDailyPunches();
    const { selectedDate } = useTimeclockStore();

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Card className="animate-pulse">
                    <CardHeader>
                        <div className="h-4 bg-muted rounded w-24"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="h-3 bg-muted rounded w-full"></div>
                            <div className="h-3 bg-muted rounded w-full"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (clockIns.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No timesheet entries found for selected day.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="items-center">
                <h2 className="text-xl font-bold text-center">{format(new Date(selectedDate + 'T00:00:00'), 'iii. MMM, d')}</h2>
                <h3 className="text-lg font-semibold text-center">{format(new Date(selectedDate + 'T00:00:00'), 'EEEE')}'s Clock In's</h3>
            </div>
        

            {clockIns.map((clockIn) => (
                <Card
                    key={clockIn.timesheet_entry_id}
                    className="hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <CardContent>
                        <div className="text-lg font-bold">{clockIn.project_name}</div>
                        <div className="flex">
                            <div className="font-bold">
                                <p>Time In:</p>
                                <p>Time Out:</p>
                                <p>Total:</p>
                            </div>
                            <div className="ml-2">
                                <p>{format(new Date(clockIn.time_in), 'h:mm a')}</p>
                                <p>{clockIn.time_out ? format(new Date(clockIn.time_out), 'h:mm a') : 'Active'}</p>
                                <p>{formatDuration(clockIn.duration)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
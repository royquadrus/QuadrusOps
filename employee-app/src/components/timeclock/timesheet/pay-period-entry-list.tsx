"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { formatDuration } from "@/lib/utils/time-utils";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export function PayPeriodEntryList() {
    const { timesheetDays, selectedPayPeriod, isLoading } = useTimeclockStore();

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(7)].map((_, index) => (
                    <Card key={index} className="animate-pulse">
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
                ))}
            </div>
        );
    }

    if (!selectedPayPeriod) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Please select a pay period to view timesheet data.
            </div>
        );
    }

    if (timesheetDays.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No timesheet data found for the selected pay period.
            </div>
        );
    }

    // Calculate total hours for the pay period.
    const totalPayPeriodHours = timesheetDays.reduce((sum, day) => sum + day.total_hours, 0);

    const getStatusIcon = (status: string | null, totalPunches: number) => {
        if (!status) {
            return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
        }

        switch (status.toLowerCase()) {
            case 'open':
                return <Clock className="h-4 w-4 text-blue-500" />;
            case 'submitted':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            default:
                return <AlertCircle className="h-4 w-4 text-yellow-500" />;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Timesheet Summary</h3>
                <div className="text-sm text-muted-foreground">
                    Total: {formatDuration(totalPayPeriodHours)}
                    <span className="ml-2">
                        ({new Date(selectedPayPeriod.start_date).toLocaleDateString()} - {new Date(selectedPayPeriod.end_date).toLocaleDateString()})
                    </span>
                </div>
            </div>

            {timesheetDays.map((day) => {
                const date = new Date(day.date + 'T00:00:00');
                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                const formattedDate = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                });

                const hasTimeEntries = day.total_punches > 0;
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                return (
                    <Card
                        key={day.date}
                    >
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                {dayOfWeek}, {formattedDate}
                                {isWeekend && (
                                    <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                                        Weekend
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div>
                                <p>Total Punches: {day.total_punches}</p>
                            </div>
                            <div>
                                <p>Total Hours: {formatDuration(day.total_hours)}</p>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    );
}
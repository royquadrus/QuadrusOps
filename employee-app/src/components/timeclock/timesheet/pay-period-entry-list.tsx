"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTimeclockData } from "@/hooks/use-timeclock-data";
import { useSubmitTimesheet } from "@/hooks/use-timesheet-entries-data";
import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { dateTime } from "@/lib/utils/datetime-utils";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export function PayPeriodEntryList() {
    const { timesheetDays, selectedPayPeriod, isLoading, setSelectedDate } = useTimeclockStore();
    const { refetchTimesheetDays } = useTimeclockData();
    const router = useRouter();
    const { isSubmitting, submitTimesheet } = useSubmitTimesheet();

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

    // Timesheet status
    const status = timesheetDays[0].status;
    const timesheetId = timesheetDays[0].timesheet_id;
    console.log('timesheet id is:', timesheetId);

    const backgroundColor = status === 'Open'
        ? 'bg-sky-600/50'
        : status === 'Submitted'
            ? 'bg-amber-200/50'
            : status === 'Rejected'
                ? 'bg-red-500/50'
                : status === 'Approved'
                    ? 'bg-green-500/50'
                    : 'bg-gray/50';

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

    const handleCardClick = (date: string) => {
        setSelectedDate(date);
        router.push('/timeclock/timesheet/daily-detail');
    };

    return (
        <div className="space-y-4">
            <Card className={backgroundColor}>
                <CardHeader>
                    <CardTitle>Timesheet Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        Total: {dateTime.formatDuration(totalPayPeriodHours)}
                        <span className="ml-2">
                            ({dateTime.formatForDisplay(selectedPayPeriod.start_date, { includeTime: false })} - {dateTime.formatForDisplay(selectedPayPeriod.end_date, { includeTime: false })})
                        </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Status: {status}
                    </div>
                    {status === 'Open' || status === 'Rejected' ? (
                        <Button
                            type="button"
                            className="w-full"
                            onClick={() => {
                                if (!timesheetId) return;
                                submitTimesheet(timesheetId);
                                refetchTimesheetDays();
                            }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Timesheet"}
                        </Button>
                    ) : (
                        <div />
                    )}
                </CardContent>
            </Card>

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
                        className="hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        onClick={() => handleCardClick(day.date)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleCardClick(day.date);
                            }
                        }}
                        tabIndex={0}
                        role="button"
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
                                <p>Total Hours: {dateTime.formatDuration(day.total_hours)}</p>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    );
}
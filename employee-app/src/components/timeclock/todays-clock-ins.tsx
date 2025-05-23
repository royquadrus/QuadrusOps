"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useTodaysClockIns } from "@/hooks/use-todays-clock-ins";
import { format } from "date-fns";

export function TodaysClockIns() {
    const { clockIns, isLoading, refetch } = useTodaysClockIns();

    const handleRefresh = async () => {
        await refetch();
    };

    const formatClockInTime = (timeString: string) => {
        try {
            const date = new Date(timeString);
            return format(date, 'h:mm a');
        } catch {
            return timeString;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Today's Clock Ins</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && clockIns.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            Loading clock-ins...
                        </div>
                    </div>
                ) : clockIns.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-muted-foreground">No clock-ins recorded today</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {clockIns.map((clockIn) => (
                            <div
                                key={clockIn.id}
                                className="items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-color"
                            >
                                <p className="font-bold text-xl">{clockIn.projectName}</p>
                                <p className="text-sm">{formatClockInTime(clockIn.timeIn)} - {formatClockInTime(clockIn.timeOut)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
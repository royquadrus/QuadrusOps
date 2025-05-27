"use client";

import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useClockActions } from "@/hooks/use-clock-actions";

export function ClockedInCard() {
    const { activeEntry } = useTimeclockStore();
    const { isLoading, clockOut } = useClockActions();

    const [elapsedTime, setElapsedTime] = useState(0);

    const formatElapsedTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    };

    useEffect(() => {
        if (!activeEntry?.time_in) return;

        const startTime = new Date(activeEntry.time_in);
        const now = new Date();
        const initialElapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(initialElapsedSeconds);

        const timer = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [activeEntry?.time_in]);

    if (!activeEntry) {
        return null;
    }

    return (
        <Card>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm font-build">Working On</p>
                    <p className="text-sm font-medium">{activeEntry.project_name}</p>
                    <p className="col-span-2 text-3xl">{formatElapsedTime(elapsedTime)}</p>
                </div>
                <Button
                    className="w-full"
                    onClick={() => clockOut(activeEntry.timesheet_entry_id)}
                    disabled={isLoading}
                    variant="destructive"
                >
                    {isLoading ? "Clocking out..." : "Clock Out"}
                </Button>
            </CardContent>
            
        </Card>
    );
}
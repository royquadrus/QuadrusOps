"use client";

import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { formatDuration } from "@/lib/utils/time-utils";
import { useEffect, useState } from "react";
import { useClockOut } from "@/hooks/use-clock-actions";

export function ClockedInCard() {
    const { activeEntry, projects, tasks } = useTimeclockStore();
    const { isLoading, clockOut } = useClockOut();

    const [elapsedTime, setElapsedTime] = useState(0);

    const project = projects.find(p => p.id === activeEntry?.projectId);
    const task = tasks.find(t => t.id === activeEntry?.taskId);

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
        if (!activeEntry?.timeIn) return;

        const startTime = new Date(activeEntry.timeIn);
        const now = new Date();
        const initialElapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(initialElapsedSeconds);

        const timer = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [activeEntry?.timeIn]);

    if (!activeEntry) {
        return null;
    }

    return (
        <Card>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm font-build">Working On</p>
                    <p className="text-sm font-medium">{activeEntry.projectName}</p>
                    <p className="col-span-2 text-3xl">{formatElapsedTime(elapsedTime)}</p>
                </div>
                <Button
                    className="w-full"
                    onClick={() => clockOut(activeEntry.id)}
                    disabled={isLoading}
                    variant="destructive"
                >
                    {isLoading ? "Clocking out..." : "Clock Out"}
                </Button>
            </CardContent>
            
        </Card>
    );
}
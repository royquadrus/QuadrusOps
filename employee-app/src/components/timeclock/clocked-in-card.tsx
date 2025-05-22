"use client";

import { useClockOut } from "@/hooks/use-timeclocks";
import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

export function ClockedInCard() {
    const { activeEntry, projects, tasks } = useTimeclockStore();
    const { isLoading, clockOut } = useClockOut();

    const project = projects.find(p => p.id === activeEntry?.projectId);
    const task = tasks.find(t => t.id === activeEntry?.taskId);

    const startTime = new Date(activeEntry?.timeIn);
    const elapsedTime = formatDuration(startTime, new Date());

    return (
        <Card>
            <CardContent>
                <div>A bunch of card content</div>
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
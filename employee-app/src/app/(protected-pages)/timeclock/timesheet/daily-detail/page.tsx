"use client";

import { DailyPunchesList } from "@/components/timeclock/timesheet/daily-detail/daily-punches-list";
import { useDailyPunches } from "@/hooks/use-timesheet-entries-data";
import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";



export default function DailyDetailPage() {
    const { selectedDate } = useTimeclockStore();
    
    return (
        <div className="container mx-auto py-8 space-y-8">
            <DailyPunchesList />
        </div>
    );
}
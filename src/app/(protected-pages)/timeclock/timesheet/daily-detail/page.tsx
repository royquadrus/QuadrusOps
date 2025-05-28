"use client";

import { DailyPunchesList } from "@/components/timeclock/timesheet/daily-detail/daily-punches-list";

export default function DailyDetailPage() {    
    return (
        <div className="container mx-auto py-8 space-y-8">
            <DailyPunchesList />
        </div>
    );
}
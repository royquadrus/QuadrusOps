"use client";

import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";



export default function DailyDetailPage() {
    const { selectedDate } = useTimeclockStore();

    //console.log("Date is:", selectedDate);
    return (
        <div className="container mx-auto py-8 space-y-8">
            <div>
                Daily detail page
            </div>
            <div>Todays date is {selectedDate}</div>
        </div>
    );
}